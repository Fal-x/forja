export interface ResultRow { house:string; discipline:string; points:number; approved:boolean; date?:string }
export interface Standing { house:string; points:number; position:number; gap:number; tied:boolean }
export interface Scoring { official:boolean; standings:Standing[]; byDiscipline:Record<string,Record<string,number>>; ignored:number }

const valid = (r:ResultRow, houses:readonly string[]) =>
  r.approved && houses.includes(r.house) && Number.isFinite(r.points) && r.points >= 0;

/** Ranking de competición: empatados comparten posición (1,1,3). Sin filas aprobadas válidas => sin clasificación. */
export function computeStandings(rows:ResultRow[], houses:readonly string[]): Scoring {
  const ok = rows.filter(r => valid(r, houses));
  const ignored = rows.length - ok.length;
  if (ok.length === 0) return { official:false, standings:[], byDiscipline:{}, ignored };
  const totals = Object.fromEntries(houses.map(h => [h, 0])) as Record<string,number>;
  const byDiscipline:Record<string,Record<string,number>> = {};
  for (const r of ok) {
    totals[r.house]! += r.points;
    const d = (byDiscipline[r.discipline] ??= {});
    d[r.house] = (d[r.house] ?? 0) + r.points;
  }
  const sorted = [...houses].sort((a,b) => totals[b]! - totals[a]! || a.localeCompare(b));
  const lead = totals[sorted[0]!]!;
  const standings = sorted.map(h => {
    const points = totals[h]!;
    return { house:h, points, position:sorted.findIndex(x => totals[x] === points) + 1, gap:lead - points, tied: sorted.filter(x => totals[x] === points).length > 1 };
  });
  return { official:true, standings, byDiscipline, ignored };
}
