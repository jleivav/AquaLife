import { Icon } from './Icon'
import { initialParameters } from '../data/simulationParameters'

const controls = [
  { key: 'temperature', label: 'Temperatura', unit: '°C', min: 15, max: 35, step: 1 },
  { key: 'ph', label: 'pH', unit: '', min: 5, max: 9, step: 0.1 },
  { key: 'oxygen', label: 'Oxígeno', unit: 'mg/L', min: 0, max: 12, step: 0.1 },
  { key: 'light', label: 'Iluminación', unit: 'h / día', min: 0, max: 24, step: 1 },
] as const

export function SimulationParameters({ parameters, onChange, onRun }: {
  parameters: typeof initialParameters
  onChange: (parameters: typeof initialParameters) => void
  onRun: () => void
}) {

  return (
    <section className="card simulation-panel simulation-parameters" id="simulation-parameters" aria-labelledby="parameters-title">
      <div className="simulation-panel-heading">
        <h2 id="parameters-title"><Icon name="filter" size={18} />Parámetros</h2>
        <span className="simulation-label">Configuración</span>
      </div>
      <p className="simulation-description">Explora los controles de tu acuario.</p>
      <label className="simulation-select">
        <span>Pecera</span>
        <select value={parameters.volume}
          onChange={(event) => onChange({ ...parameters, volume: event.target.value })}>
          <option value="60">60 L · Mi primer acuario</option>
          <option value="120">120 L · Acuario plantado</option>
          <option value="200">200 L · Acuario comunitario</option>
        </select>
      </label>
      <div className="simulation-controls">
        {controls.map((control) => (
          <div className="simulation-range" key={control.key}>
            <div>
              <label htmlFor={`parameter-${control.key}`}>{control.label}</label>
              <output htmlFor={`parameter-${control.key}`}>
                {parameters[control.key].toLocaleString('es-CL', { minimumFractionDigits: ['ph', 'oxygen'].includes(control.key) ? 1 : 0 })} {control.unit}
              </output>
            </div>
            <input id={`parameter-${control.key}`} type="range"
              min={control.min} max={control.max} step={control.step} value={parameters[control.key]}
              aria-valuetext={`${parameters[control.key]} ${control.unit}`}
              onChange={(event) => onChange({ ...parameters, [control.key]: Number(event.target.value) })} />
            <div className="simulation-range-limits" aria-hidden="true"><span>{control.min} {control.unit}</span><span>{control.max} {control.unit}</span></div>
          </div>
        ))}
      </div>
      <div className="simulation-timing">
        <label>Duración
          <select value={parameters.duration} onChange={(event) => onChange({ ...parameters, duration: event.target.value })}>
            <option value="1">1 día</option><option value="3">3 días</option><option value="7">7 días</option>
          </select>
        </label>
        <label>Intervalo
          <select value={parameters.interval} onChange={(event) => onChange({ ...parameters, interval: event.target.value })}>
            <option value="1">1 hora</option><option value="6">6 horas</option><option value="12">12 horas</option>
          </select>
        </label>
      </div>
      <div className="simulation-parameter-actions">
        <button className="primary-button" onClick={onRun}>Aplicar escenario<Icon name="arrow" size={16} /></button>
        <button className="simulation-reset" onClick={() => onChange(initialParameters)}>Restablecer parámetros</button>
      </div>
      <p className="simulation-control-note"><Icon name="book" size={16} />Aplica los cambios para actualizar el escenario y recorrer sus horas.</p>
    </section>
  )
}
