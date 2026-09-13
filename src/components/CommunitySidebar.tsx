import { useState } from 'react'
import type { FormEvent } from 'react'
import { connections, ranking } from '../data/community'
import { Avatar } from './Avatar'
import { Icon } from './Icon'

export function CommunitySidebar() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [messagePreview, setMessagePreview] = useState('')
  const [notificationRead, setNotificationRead] = useState(false)
  const leaders = [...ranking].sort((a, b) => b[period] - a[period])

  function previewMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim()) return
    setMessagePreview(message.trim())
    setMessage('')
  }

  function selectRecipient(name: string) {
    setRecipient(recipient === name ? '' : name)
    setMessage('')
    setMessagePreview('')
  }

  return (
    <aside className="community-sidebar" aria-label="Actividad de la comunidad">
      <section className="card ranking-card" id="ranking" aria-labelledby="ranking-title">
        <header className="side-card-heading">
          <h2 id="ranking-title"><span className="trophy-icon"><Icon name="trophy" size={19} /></span>Ranking</h2>
          <label>
            <span className="sr-only">Período del ranking</span>
            <select value={period} onChange={(event) => setPeriod(event.target.value as 'week' | 'month')}>
              <option value="week">Semana</option><option value="month">Mes</option>
            </select>
          </label>
        </header>
        <p className="small-muted side-card-description">Personas que hacen crecer la comunidad</p>
        <ol className="ranking-list">
          {leaders.map((member, index) => (
            <li key={member.name}>
              <span className={`rank-number ${index === 0 ? 'rank-number--first' : ''}`}>{index + 1}</span>
              <Avatar member={member} small />
              <div className="rank-person">
                <strong>{member.name}</strong><span>{index === 0 ? 'Acuarista destacado' : 'Explorador acuático'}</span>
              </div>
              <span className="rank-score">{member[period].toLocaleString('es-CL')}<small>pts</small></span>
            </li>
          ))}
        </ol>
        <div className="ranking-footer"><Icon name="leaf" size={15} />Comparte, aprende y suma experiencias</div>
      </section>

      <section className="card connections-card" aria-labelledby="connections-title">
        <header className="side-card-heading"><h2 id="connections-title">Mis conexiones</h2><span className="online-count">2 en línea</span></header>
        <ul className="connections-list">
          {connections.map((member) => (
            <li key={member.name}>
              <span className="connection-avatar"><Avatar member={member} small /><span className={`presence-dot ${member.online ? 'online' : ''}`} /></span>
              <div className="connection-person"><strong>{member.name}</strong><span>{member.online ? 'En línea' : 'Desconectado'}</span></div>
              <button className="icon-button" aria-label={`Escribir mensaje a ${member.name}`}
                aria-expanded={recipient === member.name} onClick={() => selectRecipient(member.name)}>
                <Icon name="message" size={18} />
              </button>
            </li>
          ))}
        </ul>
        {recipient && (
          <form className="message-preview" onSubmit={previewMessage}>
            <label htmlFor="connection-message">Mensaje para {recipient}</label>
            <p className="small-muted">Prueba local: el mensaje no se envía.</p>
            <textarea id="connection-message" value={message} onChange={(event) => setMessage(event.target.value)}
              maxLength={400} rows={3} placeholder="Escribe tu mensaje…" required />
            <button className="secondary-button" type="submit" disabled={!message.trim()}>Probar mensaje<Icon name="send" size={15} /></button>
            {messagePreview && <p className="local-message" role="status">Vista previa: {messagePreview}</p>}
          </form>
        )}
      </section>

      <section className="card notifications-card" id="notificaciones" aria-labelledby="notifications-title">
        <header className="side-card-heading"><h2 id="notifications-title">Notificaciones</h2><span className="count-badge">{notificationRead ? 0 : 3}</span></header>
        <ul className={`notification-list ${notificationRead ? 'is-read' : ''}`}>
          <li>
            <span className="activity-icon activity-icon--peach"><Icon name="like" size={16} /></span>
            <p><strong>Tu comunidad está creciendo.</strong><span>Descubre nuevas experiencias.</span><small>Actividad de ejemplo</small></p>
          </li>
          <li>
            <span className="activity-icon"><Icon name="message" size={16} /></span>
            <p><strong>Camila tiene una pregunta.</strong><span>Comparte lo que has aprendido.</span><small>Actividad de ejemplo</small></p>
          </li>
          <li>
            <span className="activity-icon activity-icon--purple"><Icon name="users" size={16} /></span>
            <p><strong>¡Bienvenido a Aqua Life!</strong><span>Tu próxima idea empieza aquí.</span><small>Actividad de ejemplo</small></p>
          </li>
        </ul>
        <button className="mark-read" onClick={() => setNotificationRead(true)} disabled={notificationRead}>
          {notificationRead ? 'Todas leídas' : 'Marcar todas como leídas'}<Icon name="check" size={15} />
        </button>
      </section>
      <footer className="sidebar-footer">
        <span>Aqua Life · Aprende. Comparte. Cuida.</span>
        <span>Hecho para conectar con la vida acuática.</span>
      </footer>
    </aside>
  )
}
