// Revisa que todo esté listo para editar y crea lo que falte.
// Uso: node scripts/preparar.mjs
import fs from 'fs';
import { execFileSync } from 'child_process';
import { ruta, capcutAbierto } from './comun.mjs';

const res = [];
const ok = (nombre, bien, detalle = '') => res.push({ nombre, bien, detalle });
const probar = (cmd, args) => { try { return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).split('\n')[0].trim(); } catch { return null; } };

ok('Node.js 18 o superior', +process.versions.node.split('.')[0] >= 18, process.versions.node);
const f1 = probar('ffmpeg', ['-version']); ok('ffmpeg', !!f1, f1 ? f1.slice(0, 40) : 'no está en el PATH: instálalo y vuelve a correr esto');
const f2 = probar('ffprobe', ['-version']); ok('ffprobe', !!f2, f2 ? '' : 'viene con ffmpeg');
for (const dep of ['capcut-cli', '@huggingface/transformers'])
  ok('dependencia ' + dep, fs.existsSync(ruta('node_modules', dep)), fs.existsSync(ruta('node_modules', dep)) ? '' : 'falta: corre "npm install" en la carpeta del proyecto');

// carpeta de borradores de CapCut
const cand = process.platform === 'win32'
  ? [`${process.env.LOCALAPPDATA}/CapCut/User Data/Projects/com.lveditor.draft`]
  : [`${process.env.HOME}/Movies/CapCut/User Data/Projects/com.lveditor.draft`];
const store = cand.find(c => fs.existsSync(c));
ok('Carpeta de borradores de CapCut', !!store, store || 'no la encuentro: abre CapCut una vez y crea un proyecto cualquiera');
ok('CapCut cerrado (necesario solo al escribir el borrador)', !capcutAbierto(), capcutAbierto() ? 'está abierto ahora' : '');

// carpetas del usuario
for (const d of ['videos-crudos', 'recursos/sonidos', 'recursos/musica', 'trabajo']) fs.mkdirSync(ruta(d), { recursive: true });
const cuenta = (d, re) => fs.readdirSync(ruta(d)).filter(f => re.test(f)).length;
const VID = /\.(mp4|mov|mkv|m4v)$/i;
const estado = {
  videos_crudos: cuenta('videos-crudos', VID),
  sonidos: cuenta('recursos/sonidos', /\.(mp3|wav|m4a)$/i),
  musica: cuenta('recursos/musica', /\.(mp3|wav|m4a)$/i),
};
console.log(JSON.stringify({ listo: res.filter(r => !r.nombre.startsWith('CapCut cerrado')).every(r => r.bien), revisiones: res, carpetas: estado }, null, 1));
