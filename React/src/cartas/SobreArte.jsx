// El dibujo del sobre, sin gestos: lo usan la tienda y la apertura
export default function SobreArte({ sobre, innerRef, className = '', ...resto }) {
  return (
    <div className={`sobre sobre--${sobre.tono} ${className}`.trim()} ref={innerRef} {...resto}>
      <div className="sobre__canto" aria-hidden="true" />
      <div className="sobre__cuerpo">
        <span className="sobre__marca">ÚLTIMA<br />ENTRADA</span>
        <strong className="sobre__nombre">{sobre.nombre}</strong>
        <small className="sobre__cantidad">{sobre.cantidad} CARTAS</small>
        <span className="sobre__foil" aria-hidden="true" />
      </div>
      <div className="sobre__tapa" aria-hidden="true">
        <span className="sobre__foil" />
        <span className="sobre__corte" />
      </div>
    </div>
  )
}
