import { Header } from '../components/Header'
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
                <button className="primary-button" disabled>Iniciar simulación<Icon name="arrow" size={16} /></button>
              </div>
            </div>
            <div className="dashboard-welcome-art" aria-hidden="true"><Icon name="leaf" size={100} /></div>
          </section>

          <section className="card dashboard-summary" aria-labelledby="dashboard-parameters-title">
            <h2 id="dashboard-parameters-title"><Icon name="drop" size={19} />Parámetros</h2>
            <div className="dashboard-card-body"><p>Un resumen de los parámetros del agua de tu acuario.</p></div>
            <button className="dashboard-card-link" disabled>Ver más<Icon name="arrow" size={16} /></button>
          </section>
          <section className="card dashboard-summary" aria-labelledby="dashboard-results-title">
            <h2 id="dashboard-results-title"><Icon name="chart" size={19} />Resultados</h2>
            <div className="dashboard-card-body"><p>Observa la evolución del ecosistema a lo largo del tiempo.</p></div>
            <button className="dashboard-card-link" disabled>Ver detalles<Icon name="arrow" size={16} /></button>
          </section>
          <section className="card dashboard-summary" aria-labelledby="dashboard-community-title">
            <h2 id="dashboard-community-title"><Icon name="users" size={19} />Comunidad</h2>
            <div className="dashboard-card-body"><p>Conecta con otras personas y comparte lo que aprendes.</p></div>
            <a className="dashboard-card-link" href="#comunidad">Ver comunidad<Icon name="arrow" size={16} /></a>
          </section>

          <section className="card dashboard-shortcuts" aria-labelledby="shortcuts-title">
            <h2 id="shortcuts-title">Accesos rápidos</h2>
            <nav className="dashboard-shortcut-grid" aria-label="Accesos rápidos">
              <button disabled><Icon name="flask" size={25} /><span>Nueva simulación</span></button>
              <button disabled><Icon name="bookmark" size={25} /><span>Simulaciones guardadas</span></button>
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
