// Genera efectos de sonido básicos con ffmpeg (sin descargar nada ni usar material con derechos).
// Solo crea los que falten en recursos/sonidos. Si pones ahí tus propios tap.mp3, swish.wav, etc., se usan los tuyos.
// Uso: node scripts/sonidos.mjs
import fs from 'fs';
import { ruta, ff } from './comun.mjs';

const dir = ruta('recursos', 'sonidos'); fs.mkdirSync(dir, { recursive: true });
const tiene = (n) => fs.readdirSync(dir).some(f => f.replace(/\.[^.]+$/, '') === n);
const S = {
  tap: ['-f', 'lavfi', '-i', 'sine=f=1100:d=0.07', '-af', 'afade=t=out:st=0.005:d=0.06,volume=0.9'],
  pop: ['-f', 'lavfi', '-i', 'sine=f=520:d=0.14', '-af', 'asetrate=44100*1.5,aresample=44100,afade=t=out:st=0.01:d=0.08'],
  swish: ['-f', 'lavfi', '-i', 'anoisesrc=d=0.5:c=pink:a=0.8', '-af', 'highpass=f=900,afade=t=in:d=0.22,afade=t=out:st=0.22:d=0.28'],
  woosh: ['-f', 'lavfi', '-i', 'anoisesrc=d=1.2:c=brown:a=1', '-af', 'bandpass=f=500:w=600,afade=t=in:d=0.7,afade=t=out:st=0.7:d=0.5,volume=3'],
  bien: ['-f', 'lavfi', '-i', 'sine=f=880:d=0.12', '-f', 'lavfi', '-i', 'sine=f=1320:d=0.35', '-filter_complex', '[0][1]concat=n=2:v=0:a=1,afade=t=out:st=0.2:d=0.27,volume=0.6'],
};
const hechos = [];
for (const [n, args] of Object.entries(S)) {
  if (tiene(n)) continue;
  ff(...args, '-ar', 44100, '-ac', 2, `${dir}/${n}.wav`); hechos.push(n);
}
console.log(hechos.length ? 'sonidos creados: ' + hechos.join(', ') : 'ya estaban todos');
