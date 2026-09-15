import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
import { AquariumScene } from '../components/AquariumScene'
import { SimulationParameters } from '../components/SimulationParameters'
import { simulationHistory, simulationMetrics } from '../data/simulation'
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

              <span className="simulation-alert-count">
                2 avisos
              </span>
            </div>

            <ul className="simulation-alert-list">
              <li>
                <span className="simulation-alert-icon">
                  <Icon name="chart" size={18} />
                </span>

                <div>
                  <h3>pH en aumento</h3>

                  <details>
                    <summary>Ver aviso de pH</summary>

                    <p>
                      El registro de ejemplo llegó a 7,6. Esta alerta
                      ilustra una variación del pH durante el día.
                    </p>
                  </details>
                </div>
              </li>

              <li>
                <span className="simulation-alert-icon simulation-alert-icon--blue">
                  <Icon name="drop" size={18} />
                </span>

                <div>
                  <h3>Oxígeno en descenso</h3>

                  <details>
                    <summary>Ver aviso de oxígeno</summary>

                    <p>
                      El registro de ejemplo llegó a 5,1 mg/L. Esta alerta
                      ilustra una caída del oxígeno durante el día.
                    </p>
                  </details>
                </div>
              </li>
            </ul>
          </section>

          <section
            className="card simulation-panel simulation-history"
            id="simulation-history"
            aria-labelledby="history-title"
          >
            <div className="simulation-panel-heading">
              <h2 id="history-title">
                <Icon name="book" size={18} />
                Historial de simulaciones
              </h2>

              <span className="simulation-label">
                Ejemplos
              </span>
            </div>

            <table className="simulation-history-table">
              <caption className="sr-only">
                Simulaciones anteriores de ejemplo
              </caption>

              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Duración</th>
                </tr>
              </thead>

              <tbody>
                {simulationHistory.map((item) => (
                  <tr key={item.date}>
                    <th scope="row">
                      <strong>{item.name}</strong>
                      <span>Pecera · {item.volume}</span>
                    </th>

                    <td>
                      <time dateTime={item.date}>
                        {item.label}
                      </time>
                    </td>

                    <td>{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
