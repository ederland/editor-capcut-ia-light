// Utilidades compartidas por todos los scripts.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ruta = (...p) => path.join(RAIZ, ...p);
export const leerJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
export const estilo = () => leerJson(ruta('estilo.json'));

// capcut-cli instalado dentro del proyecto (npm install)
const BIN = ruta('node_modules', 'capcut-cli', 'dist', 'index.js');
export const capcut = (...a) => execFileSync(process.execPath, [BIN, ...a.map(String)], { encoding: 'utf8', maxBuffer: 1 << 28 });
export const capcutJson = (...a) => JSON.parse(capcut(...a));

export const ff = (...a) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...a.map(String)], { maxBuffer: 1 << 30 });
export const duracion = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }));

// Carpeta de trabajo de un video: trabajo/<nombre>/
export const carpetaTrabajo = (nombre) => { const d = ruta('trabajo', nombre); fs.mkdirSync(d, { recursive: true }); return d; };

// Resuelve una ruta escrita relativa a la raíz del proyecto.
export const abs = (p) => (path.isAbsolute(p) ? p : ruta(p)).replace(/\\/g, '/');

export const capcutAbierto = () => {
  try {
    const out = process.platform === 'win32' ? execFileSync('tasklist', { encoding: 'utf8' }) : execFileSync('ps', ['-A'], { encoding: 'utf8' });
    return /capcut/i.test(out);
  } catch { return false; }
};
