// Transcribe con tiempos por palabra (Whisper local, sin API ni conexión una vez descargado el modelo).
// Uso: node scripts/palabras.mjs <audio o video> <salida.json>
// La primera vez descarga el modelo (~250 MB) a la carpeta .modelos del proyecto.
import fs from 'fs';
import { execFileSync } from 'child_process';
import { pipeline, env } from '@huggingface/transformers';
import { ruta, estilo } from './comun.mjs';

env.cacheDir = ruta('.modelos');
const [, , file, out] = process.argv;
if (!file || !out) { console.error('Uso: node scripts/palabras.mjs <audio o video> <salida.json>'); process.exit(1); }
const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vn', '-ac', '1', '-ar', '16000', '-f', 'f32le', 'pipe:1'], { maxBuffer: 1 << 30 });
const audio = new Float32Array(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / 4));
const model = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-small_timestamped', { dtype: 'q8' });
const r = await model(audio, { language: estilo().idioma || 'spanish', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5, return_timestamps: 'word' });
const words = (r.chunks || []).map(c => ({ w: c.text.trim(), s: c.timestamp?.[0] ?? 0, e: c.timestamp?.[1] ?? (c.timestamp?.[0] ?? 0) + 0.3 })).filter(x => x.w);
fs.writeFileSync(out, JSON.stringify(words, null, 0).replace(/\},/g, '},\n'));
console.log(words.length, 'palabras');
console.log(words.map(w => `${w.s.toFixed(2)} ${w.w}`).join(' | '));
