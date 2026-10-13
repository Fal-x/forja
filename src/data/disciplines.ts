export interface Discipline { slug:string; name:string; description:string }
export const disciplines: readonly Discipline[] = [
{slug:'running',name:'Running',description:'Velocidad, resistencia y relevos. La perseverancia se mide en cada tramo.'},
{slug:'karate',name:'Karate',description:'Autocontrol, técnica y respeto. Modalidad escolar de captura del pañuelo.'},
{slug:'microfutbol',name:'Microfútbol',description:'Trabajo colectivo, estrategia, juego limpio y coordinación dentro de la cancha.'},
{slug:'gimnasia-ritmica',name:'Gimnasia rítmica',description:'Coordinación, creatividad, ritmo y expresión corporal.'},
{slug:'ajedrez-virtual',name:'Ajedrez virtual',description:'Estrategia, pensamiento crítico y dominio propio sobre el tablero.'},
{slug:'voleibol',name:'Voleibol',description:'Precisión, comunicación y trabajo en equipo por encima de la red.'}
];
