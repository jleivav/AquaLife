import { useState } from 'react'
import { Header } from '../components/Header'
import { AquariumScene } from '../components/AquariumScene'
import { SimulationParameters } from '../components/SimulationParameters'
import { initialParameters } from '../data/simulationParameters'
import './SimulationPage.css'

export function SimulationPage() {
  const [parameters, setParameters] = useState(initialParameters)
  const [scenario, setScenario] = useState(initialParameters)
  const [sample, setSample] = useState(0)
  const interval = Number(scenario.interval)
  const duration = Number(scenario.duration) * 24
  const lastSample = duration / interval
  const hour = sample * interval
  const lit = hour % 24 < scenario.light

  return <>
    <Header activePage="simulation" />
    <main className="page-shell simulation-page" id="simulacion-contenido" tabIndex={-1}>
      <div className="simulation-heading"><h1>Simulación</h1></div>
      <div className="simulation-grid">
        <SimulationParameters parameters={parameters} onChange={setParameters} onRun={() => {
          setScenario(parameters)
          setSample(0)
        }} />
        <section className="card simulation-panel simulation-preview" aria-labelledby="preview-title">
          <h2 id="preview-title">Escenario de {scenario.volume} L</h2>
          <AquariumScene />
          <p>Ilustración del acuario.</p>
        </section>
        <section className="card simulation-panel simulation-results" id="simulation-results">
          <h2>Parámetros a lo largo del escenario</h2>
          <p>La vista muestra los valores configurados durante el intervalo elegido. El ciclo de luz comienza a la hora cero de cada día.</p>
          <label htmlFor="simulation-hour">Hora del escenario</label>
          <input id="simulation-hour" type="range" min={0} max={lastSample} value={sample}
            aria-valuetext={`${hour} horas`} onChange={event => setSample(Number(event.target.value))} />
          <p role="status">Hora {hour} de {duration} · muestras cada {interval} h · {lastSample + 1} muestras</p>
          <dl className="dashboard-parameters">
            <div><dt>Temperatura configurada</dt><dd>{scenario.temperature} °C</dd></div>
            <div><dt>pH configurado</dt><dd>{scenario.ph}</dd></div>
            <div><dt>Oxígeno configurado</dt><dd>{scenario.oxygen} mg/L</dd></div>
            <div><dt>Iluminación programada</dt><dd>{lit ? 'Encendida' : 'Apagada'} · {scenario.light} h al día</dd></div>
          </dl>
          <p>Visualización de parámetros. Los valores de agua se mantienen en los niveles ingresados durante la vista.</p>
        </section>
      </div>
    </main>
  </>
}
