import { SimulationParameters } from '../components/SimulationParameters'
import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
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

              <span className="simulation-label">
                Agua dulce · 120 L
              </span>
            </div>

            <div className="simulation-preview-base">
              <Icon name="leaf" size={42} />
              <p>Tu acuario, en un solo lugar.</p>
              <span className="small-muted">
                Vista de ejemplo del ecosistema
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

              <span className="simulation-label">
                Últimas 24 horas · Ejemplo
              </span>
            </div>

            <div className="simulation-metrics">
              {[
                'Temperatura',
                'pH',
                'Calidad del agua',
                'Oxígeno',
              ].map((label) => (
                <div className="simulation-metric" key={label}>
                  <h3>{label}</h3>
                  <p>Registro del acuario</p>
                </div>
              ))}
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
