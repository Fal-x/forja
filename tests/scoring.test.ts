import { describe, it, expect } from 'vitest';
import { computeStandings, type ResultRow } from '../src/lib/scoring';
import { parseResultados } from '../src/lib/validation/schema';
const H = ['a','b','c'];
const r = (house:string, points:number, approved=true):ResultRow => ({ house, discipline:'running', points, approved });
describe('computeStandings', () => {
  it('sin resultados aprobados no hay clasificación', () => expect(computeStandings([r('a',5,false)], H).standings).toEqual([]));
  it('suma y calcula diferencia con el líder', () => {
    const s = computeStandings([r('a',10), r('a',5), r('b',20)], H).standings;
    expect(s[0]).toMatchObject({ house:'b', points:20, position:1, gap:0 });
    expect(s[1]).toMatchObject({ house:'a', points:15, position:2, gap:5 });
  });
  it('los empates comparten posición (1,1,3)', () => {
    const s = computeStandings([r('a',10), r('b',10), r('c',5)], H).standings;
    expect(s.map(x => x.position)).toEqual([1,1,3]);
    expect(s[0]!.tied).toBe(true);
  });
  it('ignora no aprobadas, negativas, NaN y casas desconocidas', () => {
    const s = computeStandings([r('a',10), r('b',99,false), r('b',-4), r('c',NaN), r('zzz',50)], H);
    expect(s.ignored).toBe(4);
    expect(s.standings.find(x => x.house==='a')!.points).toBe(10);
  });
});
describe('parseResultados', () => {
  it('normaliza texto, decimales y aprobación; rechaza inválidas', () => {
    const { rows, rejected } = parseResultados([['Casa','Disciplina','Puntos','Aprobado'],['Ágape','Ajedrez virtual','12,5','Sí'],['Gratia','Karate','','sí'],['Veritas','Karate','7','no']]);
    expect(rows[0]).toMatchObject({ house:'agape', discipline:'ajedrez-virtual', points:12.5, approved:true });
    expect(rows[1]!.approved).toBe(false);
    expect(rejected).toBe(1);
  });
});
