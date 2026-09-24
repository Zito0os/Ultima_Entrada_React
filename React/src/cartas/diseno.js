// Medidas de la carta en fracciones del ancho (x) y del alto (y), medidas desde
// arriba a la izquierda. El dibujo, la mascara del brillo en CSS y el sombreador
// leen de aqui: si una se mueve sola, el foil deja de caer sobre el marco.
export const DISENO = {
  ancho: 600,
  alto: 840,
  radio: 0.05,
  marco: 0.05,
  cabecera: { y0: 0.05, y1: 0.135 },
  arte: { x0: 0.08, y0: 0.14, x1: 0.92, y1: 0.66 },
  info: { y0: 0.69, y1: 0.86 },
  pie: { y0: 0.875, y1: 0.945 },
}

export const PROPORCION = DISENO.alto / DISENO.ancho

// Cada carta trae su propio foil, dibujado con su arte. El mapa lo usa el
// sombreador: rojo cuanto brilla, verde el tono (menos de 128 oro, de ahi
// arcoiris) y azul el angulo de la faceta, 0 si la zona es lisa.
const RUTA = `${import.meta.env.BASE_URL}cartas/`

export function rutaMapaFoil(id) {
  return `${RUTA}${id}-foil.png`
}

// El CSS no puede cambiar el tono por pixel, asi que el mapa viene partido en
// dos mascaras en gris: las zonas de oro y las de arcoiris
export function mascaraFoil(id, tipo) {
  return `url("${RUTA}${id}-${tipo}.webp")`
}
