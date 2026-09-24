// Los colores del trofeo estan en lineal. Se fijan asi porque extruirEscudo
// enciende ColorManagement para toda la app y cambiaria como se leen los hex.
export function lineal(THREE, hex) {
  return new THREE.Color().setRGB(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255, THREE.LinearSRGBColorSpace)
}

export function crearMaterial(THREE, { color, ...resto }, Tipo = THREE.MeshStandardMaterial) {
  const material = new Tipo(resto)
  material.color.copy(lineal(THREE, color))
  return material
}

// Oro un poco mas saturado que el de referencia para que no se vea paja
export const ORO = { color: 0xFFB02E, metalness: 1, roughness: 0.18 }
export const ORO_CEPILLADO = { ...ORO, roughness: 0.3 }
// Mas oscuro y mate, para detalles que tienen que separarse del oro pulido
export const ORO_VIEJO = { color: 0xC98414, metalness: 1, roughness: 0.34 }
