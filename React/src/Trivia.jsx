import { useNavigate, useParams } from 'react-router-dom'

import BottomNav from './Navigation'
import PageHeader from './PageHeader'

const triviaModes = ['SEMANAL', 'MENSUAL', 'DIARIA']

const answers = [
  { letter: 'A', text: '1921', tone: 'blue' },
  { letter: 'B', text: '1921', tone: 'green' },
  { letter: 'A', text: '1921', tone: 'blue' },
  { letter: 'A', text: '1921', tone: 'blue' },
]

export default function Trivia() {
  const { mode } = useParams()
  const navigate = useNavigate()
  const isQuestion = triviaModes.includes(mode?.toUpperCase())

  if (isQuestion) {
    return (
      <main className="trivia-shell">
        <PageHeader title="TRIVIA" backTo="/trivia" />
        <section className="trivia-question-content" aria-label={`Trivia ${mode}`}>
          <div className="trivia-progress" aria-hidden="true"><span /><span /><span className="is-current" /><span /><span /></div>
          <div className="question-card">
            <span>PREGUNTA 3&nbsp;&nbsp; - &nbsp;&nbsp;12 S</span>
            <h2>EN QUE AÑO GANARON<br />LAS YANKEES SU<br />PRIMERA SERIE<br />MUNDIAL</h2>
          </div>
          <div className="answer-list">
            {answers.map((answer, index) => (
              <button className={`answer-button answer-${answer.tone}`} type="button" key={`${answer.letter}-${index}`}>
                <span>{answer.letter}</span><strong>{answer.text}</strong>
              </button>
            ))}
          </div>
          <div className="correct-answer"><strong>CORRECTO +20 PUNTOS</strong><span>Vencieron a los Giants en seis juegos, el mismo año que inauguró el Yankee Stadium.</span></div>
          <button className="next-question-button" type="button" onClick={() => navigate('/trivia')}>SIGUIENTE PREGUNTA</button>
        </section>
        <BottomNav activeTab="inicio" onTabChange={() => {}} />
      </main>
    )
  }

  return (
    <main className="trivia-shell">
      <PageHeader title="TRIVIA" backTo="/" />
      <section className="trivia-menu-content" aria-label="Seleccionar trivia">
        <h2>Seleccionar Trivia</h2>
        <div className="trivia-modes">
          {triviaModes.map((triviaMode, index) => (
            <button className={index === 1 ? 'trivia-mode is-highlighted' : 'trivia-mode'} type="button" onClick={() => navigate(`/trivia/${triviaMode.toLowerCase()}`)} key={triviaMode}>
              {triviaMode[0] + triviaMode.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </section>
      <BottomNav activeTab="inicio" onTabChange={() => {}} />
    </main>
  )
}
