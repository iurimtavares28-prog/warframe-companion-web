import { useEffect } from 'react'
import '../styles/pages.css'
import { useAppStore } from '../store/appStore'

export default function Worldstate() {
  const { events, isLoading, settings } = useAppStore()

  useEffect(() => {
    // Dados já são sincronizados pelo hook useDataSync no App
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return '⚠️'
      case 'fissure':
        return '✨'
      case 'invasion':
        return '⚔️'
      case 'event':
        return '🎉'
      default:
        return '📌'
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'alert':
        return 'Alerta'
      case 'fissure':
        return 'Fissura'
      case 'invasion':
        return 'Invasão'
      case 'event':
        return 'Evento'
      default:
        return type
    }
  }

  const activeEvents = events.filter(e => e.active)

  const eventCounts = {
    alerts: events.filter(e => e.type === 'alert').length,
    fissures: events.filter(e => e.type === 'fissure').length,
    invasions: events.filter(e => e.type === 'invasion').length,
    events: events.filter(e => e.type === 'event').length,
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Estado do Mundo</h2>
        <span className="platform-badge">{settings.platform.toUpperCase()}</span>
      </div>

      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando eventos...</p>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="events-summary">
            <div className="summary-card">
              <span className="summary-icon">⚠️</span>
              <div>
                <h4>Alertas</h4>
                <p>{eventCounts.alerts}</p>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">✨</span>
              <div>
                <h4>Fissuras</h4>
                <p>{eventCounts.fissures}</p>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">⚔️</span>
              <div>
                <h4>Invasões</h4>
                <p>{eventCounts.invasions}</p>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">🎉</span>
              <div>
                <h4>Eventos</h4>
                <p>{eventCounts.events}</p>
              </div>
            </div>
          </div>

          <div className="events-list">
            {activeEvents.length > 0 ? (
              activeEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <span className="event-icon">{getEventIcon(event.type)}</span>
                    <div className="event-title-section">
                      <h3>{event.title}</h3>
                      <span className="event-type">{getEventTypeLabel(event.type)}</span>
                    </div>
                  </div>

                  <div className="event-body">
                    {event.location && (
                      <p><strong>Local:</strong> {event.location}</p>
                    )}
                    {event.reward && (
                      <p><strong>Recompensa:</strong> {event.reward}</p>
                    )}
                    <p><strong>Status:</strong> {event.expiry}</p>
                  </div>

                  <div className="event-footer">
                    <button className="event-action-btn">Participar</button>
                    <button className="event-notify-btn">🔔 Notificar</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Nenhum evento ativo no momento.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
