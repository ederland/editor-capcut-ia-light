# Instalación guiada (instrucciones para Claude)

Este archivo es para ti, Claude. La persona te pidió instalar este editor.
Guíala paso a paso, **una pregunta a la vez**, en lenguaje sencillo. No sigas
al paso siguiente hasta terminar el anterior. No des por hecho que sabe usar
una terminal: tú corres los comandos.

## Paso 1 — Dónde guardarlo

Pregunta: **"¿En qué carpeta quieres guardar tu editor?"** Sugiere una ruta
corta y sin tildes (por ejemplo `Documentos/editor-capcut`). Clona o copia el
repositorio ahí. Todo lo demás ocurre dentro de esa carpeta.

## Paso 2 — Requisitos

1. Corre `npm install` dentro de la carpeta (tarda unos minutos).
2. Corre `node scripts/preparar.mjs` y lee el resultado.
3. Si falta algo, ayúdale a instalarlo y vuelve a revisar:
   - **Git, Node.js 18+ y ffmpeg.** En Windows: `winget install Git.Git`,
     `winget install OpenJS.NodeJS.LTS`, `winget install Gyan.FFmpeg`. En Mac:
     Homebrew (https://brew.sh) y luego `brew install git node ffmpeg`. Después
     de instalar, puede hacer falta cerrar y reabrir Claude Code.
   - **CapCut PC**: debe estar instalado y haberse abierto al menos una vez.
     Pregúntale qué versión tiene. Este editor está probado en CapCut 9.9 para
     Windows. Si tiene la 10 o superior, avísale que puede rechazar los
     borradores y que no actualice si tiene una anterior que funciona.
   - Para cerrar CapCut del todo: en Windows, la X y revisar la barra de
     tareas; en Mac, Cmd + Q.
4. Corre `node scripts/sonidos.mjs` para crear los efectos de sonido básicos.

## Paso 3 — Presentar las dos carpetas

Explícale, mostrando la ruta completa de cada una (y dile que el archivo
`LEEME.html` tiene todas las instrucciones para consultarlas después):

- `videos-crudos/` — "Aquí pegas los videos tal cual los grabaste."
- `recursos/` — "Aquí va tu música en `musica/` y, si tienes, tus propios
  efectos de sonido en `sonidos/`."

Pídele que pegue al menos **un video crudo**.

## Paso 4 — Preguntas de ajuste

De una en una; guarda cada respuesta en `estilo.json`:

1. **Formato.** "¿Tus videos son verticales (reels, TikTok) u horizontales
   (YouTube)?" → `formato` (1080x1920 y "9:16", o 1920x1080 y "16:9").
2. **Idioma en que habla.** → `idioma` (en inglés: `spanish`, `english`…).
3. **Ritmo de los cortes.** "¿Te gustan los cortes bien pegados o con un poco
   de aire entre frases?" → pegados: `antes` 0.04, `despues` 0.08; con aire:
   `antes` 0.10, `despues` 0.20.
4. **Efectos de sonido.** "¿Pocos, normal o muchos?" → `sonidos.cantidad`.
5. **Música.** "¿Tienes música que puedas usar? Pégala en `recursos/musica`."
   Si no, los videos salen sin música y la pone en CapCut.

Muéstrale un resumen corto de cómo quedó y pregunta si quiere cambiar algo.

## Paso 5 — Dejar la skill a mano

Copia `skills/editor-capcut-light/` a la carpeta de skills de Claude de la
persona (`~/.claude/skills/editor-capcut-light/`). Dile que siempre abra
Claude en la carpeta del editor.

## Paso 6 — Primer video

Propón editar su primer video ahí mismo, siguiendo la skill. Muéstrale las
tomas que elegiste antes de escribir el borrador y explícale cómo abrirlo en
CapCut. La primera transcripción descarga un modelo de voz (~250 MB): avísale
que tarda y que solo pasa una vez; si falla a mitad, vuelve a correr el comando.

## Lo que NO haces en la instalación

- No pidas ni guardes contraseñas, claves ni cuentas: este editor no usa
  ninguna API ni servicio de pago.
- No subas sus videos a ningún sitio.
- No cambies la configuración de CapCut ni lo actualices.
