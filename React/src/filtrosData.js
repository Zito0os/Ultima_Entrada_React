// Vista previa de los filtros con CSS. Los sombreadores reales llegan en la entrega de AR.
// La rubrica prohibe blanco y negro, escala de grises, sepia, exposicion e invertidos.

export const filtros = [
  {
    id: 'original',
    nombre: 'ORIGINAL',
    parametro: null,
    css: () => 'none',
  },
  {
    id: 'desenfoque',
    nombre: 'DESENFOQUE',
    parametro: { etiqueta: 'RADIO', min: 1, max: 12, unidad: 'PX', valor: 4 },
    css: (intensidad, radio) => `blur(${(radio * intensidad) / 100}px)`,
  },
  {
    id: 'pixelado',
    nombre: 'PIXELADO',
    parametro: { etiqueta: 'TAMAÑO DEL BLOQUE', min: 2, max: 24, unidad: 'PX', valor: 4 },
    css: () => 'none',
  },
  {
    id: 'termica',
    nombre: 'TÉRMICA',
    parametro: { etiqueta: 'TEMPERATURA', min: 0, max: 100, unidad: '', valor: 60 },
    css: (intensidad, temperatura) => `saturate(${100 + (temperatura * 3 * intensidad) / 100}%) hue-rotate(${(-70 * intensidad) / 100}deg) contrast(${100 + (60 * intensidad) / 100}%)`,
  },
  {
    id: 'color',
    nombre: 'AJUSTE DE COLOR',
    parametro: { etiqueta: 'SATURACIÓN', min: 0, max: 200, unidad: '%', valor: 140 },
    css: (intensidad, saturacion) => `saturate(${100 + ((saturacion - 100) * intensidad) / 100}%)`,
  },
  {
    id: 'suavizado',
    nombre: 'SUAVIZADO',
    parametro: { etiqueta: 'SUAVIDAD', min: 0, max: 100, unidad: '', valor: 50 },
    css: (intensidad, suavidad) => `blur(${(suavidad * intensidad) / 4000}px) contrast(${100 - (18 * intensidad) / 100}%) brightness(${100 + (8 * intensidad) / 100}%)`,
  },
  {
    id: 'pastel',
    nombre: 'PASTEL',
    parametro: { etiqueta: 'LUMINOSIDAD', min: 100, max: 160, unidad: '%', valor: 125 },
    css: (intensidad, luminosidad) => `saturate(${100 - (45 * intensidad) / 100}%) brightness(${100 + ((luminosidad - 100) * intensidad) / 100}%) contrast(${100 - (12 * intensidad) / 100}%)`,
  },
]

export function buscarFiltro(id) {
  return filtros.find((filtro) => filtro.id === id) || filtros[0]
}
