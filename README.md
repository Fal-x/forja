# La Forja de Campeones (Astro SSR)
```
npm install && npm test && npm run build && node dist/server/entry.mjs
```
## Google Sheets

1. En Google Drive crea una hoja nueva y nombra la pestaña exactamente `RESULTADOS`.
2. En la primera fila usa estos encabezados: `casa | disciplina | puntos | aprobado | fecha`.
3. Registra una fila por resultado. Ejemplo **ficticio**: `Ágape | Running | 120 | sí | 2026-03-01`.
4. Comparte la hoja como **Cualquiera con el enlace: lector**.
5. Copia `.env.example` a `.env` y conserva `GOOGLE_SHEETS_PUBLIC_URL` con el enlace público de la hoja. La app convierte ese enlace en una descarga CSV usando su `gid`; no requiere API key.
6. Arranca el proyecto con `npm run dev`, abre `/api/championship` y confirma que `status` sea `official`.

`aprobado` acepta `sí`, `true`, `1`, `aprobado` o `x`. Solo las filas aprobadas, con una casa válida y puntos numéricos, suman. La portada refresca la fuente cada 60 segundos y conserva el último resultado válido si Sheets falla.
## Despliegue
Requiere hosting Node (Render, Railway, Fly.io, VPS): `npm run build` y `node dist/server/entry.mjs`; define las variables de entorno en el panel.
## Estado
Implementado: modelo de datos, puntuación con empates, validación Zod, `/api/championship` (caché 60 s, último estado válido), inicio, casas, disciplinas, pruebas.
Pendiente: ver REVIEW_REQUIRED.md y la lista de alcance en la respuesta del chat.
