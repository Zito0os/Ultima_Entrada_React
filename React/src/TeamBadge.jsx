export default function TeamBadge({ team }) {
  return (
    <div className={`team-badge badge-${team.tone}`} aria-hidden="true">
      {team.abbreviation}
    </div>
  )
}
