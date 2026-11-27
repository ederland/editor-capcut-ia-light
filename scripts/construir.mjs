// Arma el borrador de CapCut a partir de trabajo/<nombre>/plan.json
//
//   node scripts/construir.mjs <nombre> --ensayo   → lo construye en trabajo/<nombre>/ensayo (no toca CapCut)
//   node scripts/construir.mjs <nombre>            → lo escribe en CapCut (CapCut debe estar CERRADO)
//
// plan.json (lo escribe Claude contigo; ver skills/editor-capcut-light/SKILL.md):
// {
//   "nombre": "Mi video - v1",
//   "video": "videos-crudos/mi-video.mp4",
//   "tomas": [ { "id": "gancho", "in": 1.20, "out": 4.50 } ],
//   "sonidos": [ { "tipo": "tap", "toma": "gancho", "en": 0.4 } ],
//   "musica": "mi-cancion.mp3"
// }
// En sonidos, "en" son segundos desde el inicio de la toma indicada; sin "toma", desde el inicio del video.
import fs from 'fs';
import path from 'path';
import { capcut, capcutJson, estilo, carpetaTrabajo, abs, leerJson, ruta, capcutAbierto, duracion } from './comun.mjs';

const nombre = process.argv[2]; const ensayo = process.argv.includes('--ensayo');
if (!nombre) { console.error('Uso: node scripts/construir.mjs <nombre> [--ensayo]'); process.exit(1); }
const dir = carpetaTrabajo(nombre); const plan = leerJson(path.join(dir, 'plan.json')); const E = estilo();
if (!ensayo && capcutAbierto()) { console.error('CapCut está abierto. Ciérralo y vuelve a correr esto (o usa --ensayo).'); process.exit(1); }
const VIDEO = abs(plan.video); const C = E.cortes;

// ---------- 1. tomas → línea de tiempo (cortes limpios, sin silencios) ----------
let t = 0; const items = [], mapa = {};
for (const s of plan.tomas) {
  const a = Math.max(0, s.in - (s.antes ?? C.antes)), d = +(s.out + (s.despues ?? C.despues) - a).toFixed(3);
  items.push({ path: VIDEO, start: +t.toFixed(3), duration: d, sourceStart: +a.toFixed(3) });
  mapa[s.id] = { inicio: +t.toFixed(3), fin: +(t + d).toFixed(3), dur: d }; t += d;
}
const total = t;
const T = (x) => +((x.toma ? mapa[x.toma].inicio : 0) + (x.en || 0)).toFixed(3);
const spec = { name: plan.nombre, width: E.formato.ancho, height: E.formato.alto, fps: E.formato.fps, ratio: E.formato.proporcion || '9:16', tracks: [{ type: 'video', name: 'Principal', items }] };
fs.writeFileSync(path.join(dir, 'spec.json'), JSON.stringify(spec, null, 1));
const dirEnsayo = path.join(dir, 'ensayo');
if (ensayo) fs.rmSync(dirEnsayo, { recursive: true, force: true });
const comp = capcutJson('compile', path.join(dir, 'spec.json'), ...(ensayo ? ['--out', dirEnsayo] : []));
const P = ensayo ? dirEnsayo : (comp.draft_path || comp.path || comp.out || comp.project);
if (!P || !fs.existsSync(P)) { console.error('No encuentro el borrador creado. Respuesta de capcut-cli:', JSON.stringify(comp).slice(0, 400)); process.exit(1); }
console.log('borrador:', P);
console.log('tomas:', plan.tomas.length, '| duración total:', total.toFixed(2), 's');

// ---------- 2. música y sonidos ----------
const buscar = (carpeta, n) => { const d = ruta('recursos', carpeta); const f = fs.existsSync(d) && fs.readdirSync(d).find(x => x === n || x.replace(/\.[^.]+$/, '') === n); return f ? path.join(d, f).replace(/\\/g, '/') : null; };
if (plan.musica) {
  const m = buscar('musica', plan.musica);
  if (!m) console.log('AVISO: no encuentro la música', plan.musica, 'en recursos/musica');
  else {
    const r = capcutJson('add-audio', P, m, 0, Math.min(total, duracion(m) - 0.05).toFixed(2), '--volume', E.audio.musica_volumen, '--track-name', 'Musica');
    capcut('audio-fade', P, r.segment_id, '--in', 0.5, '--fade-out', 1.5, '-q');
    if (duracion(m) < total) console.log('AVISO: la música dura menos que el video; se acaba antes del final.');
    console.log('música:', path.basename(m));
  }
}
const durSfx = {}; const fin = [0, 0, 0]; let nSfx = 0;
for (const s of (plan.sonidos || []).map(s => ({ ...s, at: Math.max(0, T(s)) })).sort((a, b) => a.at - b.at)) {
  const f = buscar('sonidos', s.tipo); if (!f) { console.log('AVISO: falta el sonido', s.tipo, 'en recursos/sonidos (corre node scripts/sonidos.mjs)'); continue; }
  durSfx[f] ??= duracion(f) - 0.02; const d = Math.min(durSfx[f], total - s.at - 0.02); if (d <= 0.03) continue;
  let pista = fin.findIndex(e => e <= s.at); if (pista < 0) pista = 2; fin[pista] = s.at + d + 0.02;
  capcut('add-audio', P, f, s.at.toFixed(2), d.toFixed(3), '--volume', s.volumen ?? E.audio.sonidos_volumen, '--track-name', 'Sonidos ' + (pista + 1), '-q'); nSfx++;
}
console.log('sonidos:', nSfx);

fs.writeFileSync(path.join(dir, 'mapa-final.json'), JSON.stringify(mapa, null, 1));
const lint = (() => { try { return JSON.parse(capcut('lint', P)); } catch (e) { try { return JSON.parse(e.stdout); } catch { return null; } } })();
if (lint) console.log('validación:', JSON.stringify(lint.summary), lint.issues.filter(i => i.severity === 'error').map(i => i.message.slice(0, 160)).join(' | '));
console.log(ensayo ? 'ENSAYO listo (no se tocó CapCut).' : `Listo. Abre CapCut y busca el proyecto "${plan.nombre}".`);
