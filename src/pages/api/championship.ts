import type { APIRoute } from 'astro';
import { getChampionship } from '../../lib/sheets/championship';
export const prerender = false;
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await getChampionship()), { headers:{ 'content-type':'application/json', 'cache-control':'public, max-age=30' } });
