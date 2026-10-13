import { houseSlugs } from '../../data/houses';
import { computeStandings, type Scoring } from '../scoring';
import { parseResultados } from '../validation/schema';

export interface ChampionshipPayload extends Scoring { season:string; status:'official'|'empty'|'stale'|'unconfigured'; updatedAt:string|null; rejectedRows:number }
const env = import.meta.env;
const DEFAULT_PUBLIC_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1a8TAyzqcRzeRduMu14wXBYDP4M_Cyge43-UWy_OgxSs/edit?gid=0#gid=0';
let cache: { at:number; data:ChampionshipPayload } | null = null;   // caché + último estado válido
const empty = (status:ChampionshipPayload['status']):ChampionshipPayload =>
  ({ ...computeStandings([], houseSlugs), season:String(env.SEASON ?? '2026'), status, updatedAt:null, rejectedRows:0 });

export async function getChampionship(): Promise<ChampionshipPayload> {
  const publicUrl = String(env.GOOGLE_SHEETS_PUBLIC_URL ?? DEFAULT_PUBLIC_SHEET_URL);
  const ttl = Number(env.CACHE_TTL_SECONDS ?? 60) * 1000;
  if (cache && Date.now() - cache.at < ttl) return cache.data;
  try {
    const source = new URL(publicUrl);
    const id = source.pathname.match(/\/spreadsheets\/d\/([^/]+)/)?.[1];
    const gid = source.searchParams.get('gid') ?? source.hash.match(/gid=(\d+)/)?.[1] ?? '0';
    if (!id) throw new Error('GOOGLE_SHEETS_PUBLIC_URL no contiene un ID válido');
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${encodeURIComponent(gid)}`);
    if (!res.ok) throw new Error(`Sheets HTTP ${res.status}`);
    const values = parseCsv(await res.text());
    const { rows, rejected } = parseResultados(values);
    const s = computeStandings(rows, houseSlugs);
    const data:ChampionshipPayload = { ...s, season:String(env.SEASON ?? '2026'), status:s.official ? 'official' : 'empty', updatedAt:new Date().toISOString(), rejectedRows:rejected };
    cache = { at:Date.now(), data };
    return data;
  } catch (e) {
    console.error('[championship]', (e as Error).message);
    return cache ? { ...cache.data, status:'stale' } : empty('empty');
  }
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') {
      if (quoted && csv[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && csv[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
