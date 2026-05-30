const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const formatValue = (value, unit) =>
  unit === 'bmi' ? Number(value).toFixed(1) : `${Math.round(Number(value))}${unit}`

const formatDelta = (delta, unit) => {
  const sign = delta > 0 ? '+' : ''
  if (unit === 'bmi') return `${sign}${delta.toFixed(1)}`
  return `${sign}${Math.round(delta)}${unit}`
}

export default function MiniTrendChart({ title, data, valueKey, unit, min, max }) {
  const values = data.map((item) => Number(item[valueKey] ?? 0))
  const oldest = values[0]
  const latest = values[values.length - 1]
  const delta = latest - oldest

  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100
      const ratio = (clamp(value, min, max) - min) / (max - min)
      const y = 100 - ratio * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <article className="mini-trend-card">
      <h4>{title}</h4>
      <div className="mini-trend-meta">
        <span>
          {formatValue(oldest, unit)} {'->'} {formatValue(latest, unit)}
        </span>
        <strong>({formatDelta(delta, unit)})</strong>
      </div>

      <svg
        className="mini-trend-chart"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-label={`${title} 변화 그래프`}
      >
        <polyline
          className="mini-trend-line"
          points={points}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {values.map((value, index) => {
          const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100
          const ratio = (clamp(value, min, max) - min) / (max - min)
          const y = 100 - ratio * 100

          return <circle key={`${title}-${index}`} cx={x} cy={y} r="2.8" className="mini-trend-dot" />
        })}
      </svg>
    </article>
  )
}
