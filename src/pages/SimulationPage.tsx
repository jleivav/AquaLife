import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
import { AquariumScene } from '../components/AquariumScene'
import { SimulationParameters } from '../components/SimulationParameters'
import { simulationMetrics } from '../data/simulation'
import './SimulationPage.css'

export function SimulationPage() {
  return (
    <>
      <a className="skip-link" href="#simulacion-contenido">
        Saltar a la simulación
      </a>

      <Header activePage="simulation" />

      <main
        className="page-shell simulation-page"
        id="simulacion-contenido"
        tabIndex={-1}
      >
        <div className="simulation-heading">
          <h1>
            Simulación<span>.</span>
          </h1>

          <span className="demo-badge">
            <span />
            Vista de demostración
          </span>
        </div>

        <div className="simulation-grid">
          <SimulationParameters />

          <section
            className="card simulation-panel simulation-preview"
            aria-labelledby="preview-title"
          >
            <div className="simulation-panel-heading">
              <h2 id="preview-title">
                <Icon name="drop" size={18} />
                Vista del ecosistema
              </h2>

              <span className="simulation-status">
                <span />
                Acuario de ejemplo
              </span>
            </div>

            <AquariumScene />

            <div className="simulation-preview-caption">
              <span>
                <strong>Acuario plantado</strong>
                Agua dulce · 120 L
              </span>

              <span>
                8 peces <span aria-hidden="true">·</span> 12 plantas
              </span>
            </div>
          </section>

          <section
            className="card simulation-panel simulation-results"
            id="simulation-results"
            aria-labelledby="results-title"
          >
            <div className="simulation-panel-heading">
              <h2 id="results-title">
                <Icon name="chart" size={18} />
                Resultados
              </h2>

              <div
                className="simulation-period"
                aria-label="Período de ejemplo: día"
              >
                <button disabled title="Disponible en una próxima etapa">
                  Hora
                </button>

                <span>Día</span>

                <button disabled title="Disponible en una próxima etapa">
                  Semana
                </button>
              </div>
            </div>

            <p className="simulation-description">
              Última simulación de ejemplo · 13 de septiembre
            </p>

            <div className="simulation-metrics">
              {simulationMetrics.map((metric) => {
                const points = metric.values
                  .map(
                    (value, index) =>
                      `${32 + index * 28.8},${
                        70 -
                        ((value - metric.min) /
                          (metric.max - metric.min)) *
                          58
                      }`,
                  )
                  .join(' ')

                return (
                  <figure
                    className="simulation-metric"
                    key={metric.label}
                  >
                    <figcaption>{metric.label}</figcaption>

                    <p className="simulation-metric-value">
                      {metric.value}
                      <span>{metric.unit}</span>
                    </p>

                    <svg
                      viewBox="0 0 190 85"
                      role="img"
                      aria-label={`Ejemplo: ${metric.description}`}
                    >
                      <text
                        x="26"
                        y="15"
                        textAnchor="end"
                        fontSize="9"
                        fill="#687c78"
                      >
                        {metric.max}
                      </text>

                      <text
                        x="26"
                        y="73"
                        textAnchor="end"
                        fontSize="9"
                        fill="#687c78"
                      >
                        {metric.min}
                      </text>

                      <path
                        d="M32 12H176M32 41H176M32 70H176"
                        fill="none"
                        stroke="#e1e9e5"
                        strokeDasharray="3 4"
                      />

                      <polygon
                        points={`32,76 ${points} 176,76`}
                        fill={metric.color}
                        opacity=".10"
                      />

                      <polyline
                        points={points}
                        fill="none"
                        stroke={metric.color}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div
                      className="simulation-chart-hours"
                      aria-hidden="true"
                    >
                      <span>00 h</span>
                      <span>12 h</span>
                      <span>24 h</span>
                    </div>
                  </figure>
                )
              })}
            </div>
          </section>

          <section
            className="card simulation-panel simulation-alerts"
            aria-labelledby="alerts-title"
          >
            <div className="simulation-panel-heading">
              <h2 id="alerts-title">
                <Icon name="bell" size={18} />
                Alertas
              </h2>
            </div>

            <p className="simulation-description">
              Avisos del ecosistema que requieren atención.
            </p>
          </section>

          <section
            className="card simulation-panel simulation-history"
            id="simulation-history"
            aria-labelledby="history-title"
          >
            <div className="simulation-panel-heading">
              <h2 id="history-title">
                <Icon name="book" size={18} />
                Historial
              </h2>
            </div>

            <p className="simulation-description">
              Simulaciones anteriores para consultar.
            </p>
          </section>

          <footer
            className="card simulation-panel simulation-actions"
            aria-label="Acciones de la simulación"
          >
            <p className="small-muted">
              Las acciones de simulación son una vista de demostración.
            </p>

            <div>
              <button className="secondary-button" disabled>
                Exportar
              </button>

              <button className="secondary-button" disabled>
                <Icon name="bookmark" size={16} />
                Guardar
              </button>

              <a className="primary-button" href="#comunidad">
                <Icon name="users" size={16} />
                Ir a Comunidad
              </a>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}
