import { Header } from '../components/Header'
import { Avatar } from '../components/Avatar'
import { dashboardMembers, dashboardParameters } from '../data/dashboard'
import { WaterLandscape } from '../components/WaterLandscape'
import { Icon } from '../components/Icon'
import './DashboardPage.css'

export function DashboardPage() {
  return (
    <>
      <a className="skip-link" href="#dashboard-contenido">Saltar al inicio</a>
      <Header activePage="home" />
      <main className="page-shell dashboard-page" id="dashboard-contenido" tabIndex={-1}>
        <div className="dashboard-grid">
          <section className="card dashboard-welcome" aria-labelledby="welcome-title">
            <div className="dashboard-intro">
              <span className="dashboard-emblem"><Icon name="drop" size={52} /></span>
              <div>
                <div className="welcome-label"><span />BIENVENIDO A TU ECOSISTEMA</div>
                <h1 id="welcome-title">Bienvenido a Aqua Life<span>.</span></h1>
                <p>Simulación para cuidar el agua.</p>
                <a className="primary-button" href="#simulacion">Iniciar simulación<Icon name="arrow" size={16} /></a>
              </div>
            </div>
            <div className="dashboard-welcome-art"><WaterLandscape /></div>
          </section>

          <section className="card dashboard-summary" aria-labelledby="dashboard-parameters-title">
            <h2 id="dashboard-parameters-title"><Icon name="drop" size={19} />Parámetros</h2>
            <div className="dashboard-card-body">
              <p className="dashboard-caption">Último registro de ejemplo</p>
              <dl className="dashboard-parameters">
                {dashboardParameters.map((parameter) => (
                  <div key={parameter.label}><dt><span />{parameter.label}</dt><dd>{parameter.value}</dd></div>
                ))}
              </dl>
            </div>
            <a className="dashboard-card-link" href="#simulation-parameters">Ver más<Icon name="arrow" size={16} /></a>
          </section>
          <section className="card dashboard-summary" aria-labelledby="dashboard-results-title">
            <h2 id="dashboard-results-title"><Icon name="chart" size={19} />Resultados</h2>
            <figure className="dashboard-card-body dashboard-chart">
              <figcaption className="dashboard-caption">Índice del agua · Ejemplo</figcaption>
              <svg viewBox="0 0 300 130" role="img" aria-label="Índice ilustrativo del agua: 65, 73, 66, 77, 69 y 87 puntos de 100.">
                <path d="M18 15V105H285M18 30H285M18 65H285" stroke="#dce7e0" fill="none" />
                <path d="M25 85L75 63L125 83L175 52L225 75L275 28V105H25Z" fill="#e5f1e9" />
                <polyline points="25,85 75,63 125,83 175,52 225,75 275,28" stroke="#278774" fill="none" strokeWidth="2.5" strokeLinejoin="round" />
                {[[25, 85], [75, 63], [125, 83], [175, 52], [225, 75], [275, 28]].map(([x, y]) => (
                  <circle key={x} cx={x} cy={y} r="4" fill="#278774" stroke="#fff" strokeWidth="1.5" />
                ))}
                <text x="18" y="125" fontSize="10" fill="#687c78">Inicio</text>
                <text x="285" y="125" textAnchor="end" fontSize="10" fill="#687c78">Último registro</text>
              </svg>
            </figure>
            <a className="dashboard-card-link" href="#simulation-results">Ver detalles<Icon name="arrow" size={16} /></a>
          </section>
          <section className="card dashboard-summary" aria-labelledby="dashboard-community-title">
            <h2 id="dashboard-community-title"><Icon name="users" size={19} />Comunidad</h2>
            <div className="dashboard-card-body">
              <p className="dashboard-caption">Crezcamos juntos, gota a gota.</p>
              <ul className="dashboard-members">
                {dashboardMembers.map((member) => (
                  <li key={member.name}><Avatar member={member} small /><span>{member.name}</span><span className="dashboard-member-dot" aria-label="Perfil de ejemplo" /></li>
                ))}
              </ul>
            </div>
            <a className="dashboard-card-link" href="#comunidad">Ver comunidad<Icon name="arrow" size={16} /></a>
          </section>

          <section className="card dashboard-shortcuts" aria-labelledby="shortcuts-title">
            <h2 id="shortcuts-title">Accesos rápidos</h2>
            <nav className="dashboard-shortcut-grid" aria-label="Accesos rápidos">
              <a href="#simulacion"><Icon name="flask" size={25} /><span>Nueva simulación</span></a>
              <a href="#simulation-history"><Icon name="bookmark" size={25} /><span>Simulaciones guardadas</span></a>
              <a href="#connections-title"><Icon name="users" size={25} /><span>Mis conexiones</span></a>
              <a href="#ranking"><Icon name="trophy" size={25} /><span>Ranking</span></a>
              <a href="#comunidad"><Icon name="book" size={25} /><span>Guías y recursos</span></a>
              <a href="#publicaciones"><Icon name="message" size={25} /><span>Foros</span></a>
            </nav>
          </section>
        </div>
      </main>
    </>
  )
}
