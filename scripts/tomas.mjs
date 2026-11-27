// Dos pasos para elegir y montar las tomas de un video crudo.
//
//  node scripts/tomas.mjs detectar <video> <nombre>
//     Transcribe el crudo con tiempos por palabra y detecta los tramos con voz.
//     Deja trabajo/<nombre>/crudo-palabras.json y trabajo/<nombre>/tramos.json
//
//  node scripts/tomas.mjs montar <nombre>
//     Lee trabajo/<nombre>/plan.json (las tomas elegidas), monta el audio seguido,
//     lo transcribe otra vez y deja trabajo/<nombre>/palabras.json + mapa.json
import fs from 'fs';
import path from 'path';
import { execFileSync, spawnSync } from 'child_process';
import { estilo, carpetaTrabajo, abs, ff, leerJson, ruta, duracion } from './comun.mjs';

const [, , modo, a, b] = process.argv;
const C = estilo().cortes;

if (modo === 'detectar') {
  const video = abs(a), dir = carpetaTrabajo(b);
  // tramos con voz = huecos entre silencios
  const log = spawnSync("ffmpeg", ["-v", "info", "-i", video, "-vn", "-af", `silencedetect=noise=${C.ruido_db}dB:d=${C.silencio_min}`, "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 28 }).stderr;
  const ini = [...log.matchAll(/silence_start: ([\d.]+)/g)].map(m => +m[1]);
  const fin = [...log.matchAll(/silence_end: ([\d.]+)/g)].map(m => +m[1]);
  const total = duracion(video); const tramos = []; let t = 0;
  ini.forEach((s, i) => { if (s - t > 0.15) tramos.push({ in: +t.toFixed(2), out: +s.toFixed(2) }); t = fin[i] ?? total; });
  if (total - t > 0.15) tramos.push({ in: +t.toFixed(2), out: +total.toFixed(2) });
  fs.writeFileSync(path.join(dir, 'tramos.json'), JSON.stringify(tramos, null, 0).replace(/\},/g, '},\n'));
  console.log(tramos.length, 'tramos con voz ·', total.toFixed(1), 's de crudo');
  execFileSync(process.execPath, [ruta('scripts', 'palabras.mjs'), video, path.join(dir, 'crudo-palabras.json')], { stdio: 'inherit' });
} else if (modo === 'montar') {
  const dir = carpetaTrabajo(a); const plan = leerJson(path.join(dir, 'plan.json')); const video = abs(plan.video);
  let t = 0; const mapa = [];
  const f = plan.tomas.map((s, i) => {
    const x = Math.max(0, s.in - (s.antes ?? C.antes)), y = s.out + (s.despues ?? C.despues);
    mapa.push({ id: s.id, inicio: +t.toFixed(3), fin: +(t + y - x).toFixed(3), dur: +(y - x).toFixed(3) }); t += y - x;
    return `[0:a]atrim=${x.toFixed(3)}:${y.toFixed(3)},asetpts=PTS-STARTPTS[a${i}]`;
  });
  fs.writeFileSync(path.join(dir, 'filtro.txt'), f.join(';') + ';' + plan.tomas.map((_, i) => `[a${i}]`).join('') + `concat=n=${plan.tomas.length}:v=0:a=1[o]`);
  ff('-i', video, '-filter_complex_script', path.join(dir, 'filtro.txt'), '-map', '[o]', '-ar', 16000, '-ac', 1, path.join(dir, 'voz.wav'));
  fs.writeFileSync(path.join(dir, 'mapa.json'), JSON.stringify(mapa, null, 1));
  console.log(mapa.map(m => `${m.id} ${m.inicio}-${m.fin}`).join(' | ')); console.log('total', t.toFixed(2), 's');
  execFileSync(process.execPath, [ruta('scripts', 'palabras.mjs'), path.join(dir, 'voz.wav'), path.join(dir, 'palabras.json')], { stdio: 'inherit' });
} else {
  console.error('Uso: node scripts/tomas.mjs detectar <video> <nombre>  |  node scripts/tomas.mjs montar <nombre>'); process.exit(1);
}
