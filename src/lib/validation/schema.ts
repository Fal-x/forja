import { z } from 'zod';
import type { ResultRow } from '../scoring';
export const slugify = (s:string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,'-');
const yes = new Set(['si','true','1','aprobado','x']);
export const resultRowSchema = z.object({
  casa: z.string().min(1), disciplina: z.string().min(1), puntos: z.string().trim().min(1),
  aprobado: z.string().default(''), fecha: z.string().optional(),
}).transform((r):ResultRow => ({
  house: slugify(r.casa), discipline: slugify(r.disciplina),
  points: Number(r.puntos.replace(',', '.')), approved: yes.has(slugify(r.aprobado)), ...(r.fecha ? { date:r.fecha } : {}),
}));
/** Hoja (primera fila = encabezados) -> filas válidas; cuenta las rechazadas. */
export function parseResultados(values:string[][]): { rows:ResultRow[]; rejected:number } {
  const [head = [], ...body] = values;
  const keys = head.map(h => slugify(h));
  let rejected = 0; const rows:ResultRow[] = [];
  for (const line of body) {
    const p = resultRowSchema.safeParse(Object.fromEntries(keys.map((k,i) => [k, line[i] ?? ''])));
    if (p.success) rows.push(p.data); else rejected++;
  }
  return { rows, rejected };
}
