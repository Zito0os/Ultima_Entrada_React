const entradas = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function suma(linea) {
  return linea.reduce((total, carrera) => total + (Number(carrera) || 0), 0)
}

export default function TablaAnotacion({ serie }) {
  return (
    <table className="tabla-anotacion">
      <caption>{serie.titulo}<span className="etiqueta-simulado">SIMULADO</span></caption>
      <thead>
        <tr>
          <th scope="col"><span className="sr-only">Equipo</span></th>
          {entradas.map((entrada) => <th scope="col" key={entrada}>{entrada}</th>)}
          <th scope="col" className="columna-total">C</th>
        </tr>
      </thead>
      <tbody>
        {[serie.visitante, serie.local].map((equipo) => (
          <tr key={equipo.abreviatura}>
            <th scope="row">{equipo.abreviatura}</th>
            {equipo.entradas.map((carrera, indice) => <td key={indice}>{carrera}</td>)}
            <td className="columna-total">{suma(equipo.entradas)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
