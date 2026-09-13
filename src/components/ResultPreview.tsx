import { Icon } from './Icon'

// Ilustración fija del resultado del mockup; no ejecuta una simulación.
export function ResultPreview() {
  return (
    <figure className="result-preview">
      <figcaption>
        <span><Icon name="chart" size={17} />Seguimiento del pH</span>
        <span className="chart-label">Acuario · 120 L</span>
      </figcaption>
      <div className="chart-body">
        <div className="chart-value">
          <strong>7,0<span> pH</span></strong>
          <span>Último registro de ejemplo</span>
          <span className="chart-status"><Icon name="check" size={13} />Sin cambios bruscos</span>
        </div>
        <svg className="ph-chart" viewBox="0 0 310 100" role="img"
          aria-label="Gráfico de ejemplo del pH: lunes 6,8; martes 7,1; miércoles 7,0; jueves 7,0; viernes 6,9; sábado y domingo 7,0.">
          <path d="M10 20H300M10 45H300M10 70H300" stroke="#d7e6e0" fill="none" />
          <path d="M12 62 59 29 106 40 153 40 200 51 247 40 294 40V78H12Z" fill="#d7eee5" />
          <polyline points="12,62 59,29 106,40 153,40 200,51 247,40 294,40" stroke="#18856c" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
          <circle cx="294" cy="40" r="4" fill="#18856c" />
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
            <text key={index} x={12 + index * 47} y="97" textAnchor="middle" fill="#617a72" fontSize="11">{day}</text>
          ))}
        </svg>
      </div>
    </figure>
  )
}
