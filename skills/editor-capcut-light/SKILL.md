---
name: editor-capcut-light
description: Limpia videos hablados a cámara y los deja como borrador de CapCut PC listo para afinar a mano — corta silencios, tomas repetidas y titubeos, y agrega música y efectos de sonido. Sin subtítulos ni animaciones. Usa esta skill SIEMPRE que la persona pida "edítame este video", "límpiame el video", "quítale los silencios", "ponle música y efectos", o cuando quiera instalar o configurar este editor.
---

# Editor Light para CapCut PC

Trabajas dentro de la carpeta del proyecto (donde están `estilo.json` y `scripts/`).
Todas las rutas son relativas a esa carpeta. Háblale a la persona en su idioma,
sin tecnicismos.

**Qué hace esta versión:** cortes limpios, música y efectos de sonido.
**Qué NO hace:** subtítulos, animaciones, pantalla dividida, textos ni zooms.
Si la persona los pide, dile con claridad que esta versión no los incluye y que
puede agregarlos a mano en CapCut sobre el borrador. No los improvises.

**Si es la primera vez** (no existe `trabajo/` o pide instalar o configurar),
sigue `INSTALAR.md` antes que nada.

## Las dos carpetas de la persona

| Carpeta | Qué pone ahí |
|---|---|
| `videos-crudos/` | Los videos tal cual los grabó |
| `recursos/` | `musica/` (canciones que puede usar) y `sonidos/` (efectos) |

Lo que tú generas va en `trabajo/<nombre-del-video>/`.

## Flujo para editar un video

Llama `<nombre>` a un nombre corto sin espacios para el video.

1. **Revisar.** `node scripts/preparar.mjs`. Si falta algo, ayúdale a resolverlo.
2. **Escuchar el crudo.** `node scripts/tomas.mjs detectar videos-crudos/<archivo> <nombre>`
   Deja `tramos.json` (tramos con voz) y `crudo-palabras.json` (lo que dice, con tiempos).
   Si `tramos.json` trae muy pocos tramos para lo que dura el video, hay ruido
   de fondo y casi nada cuenta como silencio: sube `cortes.ruido_db` en
   `estilo.json` (prueba -26 y luego -22) y repite este paso.
3. **Elegir tomas.** Lee la transcripción completa.
   - Cuando una frase se repite, quédate con la ÚLTIMA toma limpia.
   - Quita titubeos, arranques en falso, muletillas largas y comentarios fuera
     de guion ("espera", "otra vez", "corta").
   - Ajusta cada `in`/`out` a los bordes de `tramos.json`, nunca en medio de
     una palabra. Si la persona habla sin pausas, corta solo donde haya
     silencio real; es mejor un corte menos que una palabra mordida.
   - No recortes contenido por tu cuenta: solo sobra lo repetido o fallido,
     salvo que pida una duración concreta.
4. **Escribir `trabajo/<nombre>/plan.json`** (el formato está al inicio de
   `scripts/construir.mjs`) con las tomas, y correr
   `node scripts/tomas.mjs montar <nombre>` → `mapa.json` con los tiempos de
   cada toma en la línea de tiempo final y `palabras.json` con lo que quedó.
   Lee `palabras.json` para confirmar que el texto final tiene sentido de corrido.
5. **Sonidos.** Completa `plan.sonidos`, según `sonidos.cantidad` del estilo:
   - `woosh` al inicio del video y en cada cambio de bloque o de tema.
   - `tap` o `pop` en palabras clave, cifras y elementos de una lista.
   - `swish` en giros ("pero", "ahora", "en cambio").
   - `bien` en confirmaciones, logros y el llamado a la acción.
   Con "poca": uno cada 8–10 s. Con "normal": uno cada 4–5 s. Con "mucha": uno
   cada 2 s. Cada sonido debe caer en una palabra concreta (mira `palabras.json`).
6. **Música.** `plan.musica` con un archivo de `recursos/musica`. Si hay varias,
   pregunta cuál o elige la que mejor encaje con el tono y dilo. Si no hay
   ninguna, omítela y avisa.
7. **Ensayar.** `node scripts/construir.mjs <nombre> --ensayo`. No toca CapCut.
   Corrige lo que falle hasta que la validación salga sin errores.
8. **Escribir el borrador.** Pídele que CIERRE CapCut y corre
   `node scripts/construir.mjs <nombre>`.
9. **Entregar.** Dile cómo se llama el proyecto en CapCut, cuánto duraba el
   crudo y cuánto dura ahora, qué tomas descartaste y por qué, dónde pusiste
   sonidos y qué cortes conviene que escuche con atención.

## Reglas que no se rompen

- CapCut cerrado al escribir. Nunca uses `--force-write`.
- No des un corte por bueno porque el archivo sea válido: tú no oyes el
  resultado. Di siempre qué no pudiste comprobar.
- Si el video viene grabado girado (ffprobe muestra `rotation`), haz antes una
  copia derecha con ffmpeg en `trabajo/<nombre>/` y usa esa.
- Todo es local: no subas el video ni los datos de la persona a ningún servicio.

## Ajustes

Viven en `estilo.json`: idioma, formato (vertical u horizontal), qué tan
agresivo es el corte de silencios, volúmenes y cantidad de sonidos. Cuando la
persona pida un cambio ("corta menos pegado", "más bajita la música"), edita ese
archivo y dile qué cambiaste.

## Preferencias aprendidas

(Anota aquí, con fecha, cada corrección que te haga la persona.)
