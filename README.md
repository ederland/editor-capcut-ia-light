# Editor IA Light para CapCut

Dale a Claude Code tu video crudo y recibe un **borrador de CapCut PC** ya
limpio: sin silencios, sin tomas repetidas ni titubeos, con música y efectos
de sonido. Tú le pones lo demás en CapCut.

Todo corre en tu computador. Sin APIs, sin cuentas, sin subir tus videos.

| Incluye | No incluye |
|---|---|
| Cortar silencios, titubeos y tomas repetidas | Subtítulos |
| Música de fondo con entrada y salida suaves | Animaciones |
| Efectos de sonido en los momentos clave | Pantalla dividida, textos y zooms |

## Instalación

> ¿Descargaste la carpeta? Abre **LEEME.html** con doble clic: son estas mismas instrucciones, con los pasos para Windows y para Mac.

No necesitas saber programar. Claude hace la instalación por ti.

**1. Ten esto instalado:**
- [Claude Code](https://claude.com/claude-code) (la app de escritorio o la terminal).
- [CapCut para PC](https://www.capcut.com/), abierto al menos una vez.

**2. Abre Claude Code y pega este mensaje:**

> Instálame este editor de video: `https://github.com/ederland/editor-capcut-ia-light`
> Sigue las instrucciones del archivo INSTALAR.md y guíame paso a paso.

**3. Responde lo que Claude te pregunte.** En este orden:
1. En qué carpeta de tu computador quieres guardarlo.
2. Si te falta algún programa (Git, Node.js o ffmpeg), te ayuda a instalarlo:
   - **Windows:** `winget install Git.Git OpenJS.NodeJS.LTS Gyan.FFmpeg`
   - **Mac:** `brew install git node ffmpeg` (necesita [Homebrew](https://brew.sh))
3. Te muestra tus dos carpetas y te pide pegar tu primer video.
4. Te pregunta por tus ajustes: formato, idioma, ritmo de cortes y cantidad de sonidos.

**4. Listo.** Dile: "edítame el video que acabo de pegar".

La instalación tarda unos 5 minutos. La primera vez que edites, descarga un
modelo de voz de unos 250 MB; eso pasa una sola vez.

## Tus dos carpetas

| Carpeta | Qué pones |
|---|---|
| `videos-crudos/` | Tus videos tal cual los grabaste |
| `recursos/` | Tu música y, si tienes, tus propios efectos de sonido |

## Uso

Con Claude Code abierto en la carpeta del editor:

> Edítame el video `mi-video.mp4`

Claude escucha el video, elige las mejores tomas, te cuenta qué va a quitar y,
con CapCut cerrado, escribe el borrador. Lo abres en CapCut y lo terminas.

También puedes pedir: "corta menos pegado", "pon menos efectos de sonido",
"déjalo en 60 segundos" o "usa esta canción".

## Tus ajustes

Viven en `estilo.json`: formato, idioma, ritmo de cortes, volúmenes y cantidad
de sonidos. Claude los define contigo en la instalación y puedes cambiarlos
cuando quieras.

## Limitaciones conocidas

- Pensado para videos **hablados a cámara**.
- Claude elige los cortes leyendo la transcripción y las pausas; no oye el
  resultado. Escucha el borrador antes de publicarlo.
- Si hablas casi sin pausas, habrá menos cortes: no se corta en medio de una palabra.
- CapCut 10 o superior puede rechazar borradores creados por herramientas.
- Probado en Windows. En Mac debería funcionar, pero no está comprobado.

## Créditos

Creado por **[Ederland](https://eder-land.com)**.

Este editor no existiría sin estas herramientas. No incluye su código: se
instalan aparte o con `npm install`, cada una con su propia licencia.

| Herramienta | Para qué se usa | Autor | Licencia |
|---|---|---|---|
| [Claude Code](https://claude.com/claude-code) | El asistente que elige las tomas y maneja todo lo demás | Anthropic | Comercial |
| [capcut-cli](https://github.com/renezander030/capcut-cli) | Leer y escribir borradores de CapCut | René Zander | MIT |
| [transformers.js](https://github.com/huggingface/transformers.js) | Ejecutar el modelo de voz en tu computador | Hugging Face | Apache-2.0 |
| [Whisper](https://github.com/openai/whisper) ([versión con tiempos por palabra](https://huggingface.co/onnx-community/whisper-small_timestamped)) | Transcribir lo que dices, palabra por palabra | OpenAI / ONNX Community | MIT |
| [FFmpeg](https://ffmpeg.org/) | Detectar silencios, sacar el audio y crear los sonidos básicos | Proyecto FFmpeg | LGPL / GPL |
| [Node.js](https://nodejs.org/) | Ejecutar los scripts | OpenJS Foundation | MIT |
| [CapCut](https://www.capcut.com/) | El editor donde terminas tu video | ByteDance | Comercial |

Proyecto independiente y no oficial: no está afiliado ni respaldado por
CapCut, ByteDance, Anthropic ni ninguna de las herramientas mencionadas.

## Licencia

MIT © Ederland. Puedes usarlo, modificarlo y compartirlo citando la autoría.
