import { useEffect } from 'react'
import '../styles/pages.css'
import { useAppStore } from '../store/appStore'

interface DashboardProps {
  onSync?: () => void
}

export default function Dashboard({ onSync }: DashboardProps) {
  const { tasks, events, lastSync } = useAppStore()

  useEffect(() => {
    // Sincronizar dados ao carregar
    if (onSync) {
      onSync()
    }
  }, [onSync])

  const dailyTasks = tasks.filter(t => t.category === 'daily')
  const completedTasks = dailyTasks.filter(t => t.completed).length
  const completionRate = dailyTasks.length > 0 ? (completedTasks / dailyTasks.length) * 100 : 0

  const activeEvents = events.filter(e => e.active).length

  const formatLastSync = () => {
    if (!lastSync) return 'Nunca'
    const now = Date.now()
    const diff = now - lastSync
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m atrás`
    const hours = Math.floor(minutes / 60)
    return `${hours}h atrás`
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <span className="sync-info">Última sincronização: {formatLastSync()}</span>
      </div>

      <div className="dashboard-grid">
        {/* Card de Boas-vindas */}
        <div className="card welcome-card">
          <h3>Bem-vindo de volta, Tenno!</h3>
          <p>Progresso de hoje: <strong>{completionRate.toFixed(0)}%</strong></p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
          </div>
          <p className="progress-detail">{completedTasks} de {dailyTasks.length} tarefas completas</p>
        </div>

        {/* Estatísticas */}
        <div className="stats-row">
          <div className="stat-mini">
            <span className="stat-icon">📋</span>
            <div>
              <p className="stat-label">Tarefas Hoje</p>
              <p className="stat-number">{dailyTasks.length}</p>
            </div>
          </div>
          <div className="stat-mini">
            <span className="stat-icon">✓</span>
            <div>
              <p className="stat-label">Completas</p>
              <p className="stat-number">{completedTasks}</p>
            </div>
          </div>
          <div className="stat-mini">
            <span className="stat-icon">🌍</span>
            <div>
              <p className="stat-label">Eventos Ativos</p>
              <p className="stat-number">{activeEvents}</p>
            </div>
          </div>
        </div>

        {/* Tarefas de Hoje */}
        <div className="card">
          <div className="card-header">
            <h3>Tarefas de Hoje</h3>
            <a href="#checklist" className="card-link">Ver todas →</a>
          </div>
          <div className="task-list">
            {dailyTasks.slice(0, 3).map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  disabled
                />
                <span className="task-title">{task.title}</span>
                <span className="task-expiry">{task.expiry}</span>
              </div>
            ))}
          </div>
          {dailyTasks.length > 3 && (
            <p className="card-footer-text">+{dailyTasks.length - 3} mais tarefas</p>
          )}
        </div>

        {/* Eventos Recentes */}
        <div className="card">
          <div className="card-header">
            <h3>Eventos em Tempo Real</h3>
            <a href="#worldstate" className="card-link">Ver todos →</a>
          </div>
          <div className="events-mini-list">
            {events.slice(0, 3).map(event => (
              <div key={event.id} className="event-mini">
                <span className="event-type-badge">{event.type === 'alert' ? '⚠️' : event.type === 'fissure' ? '✨' : '⚔️'}</span>
                <div className="event-mini-info">
                  <p className="event-mini-title">{event.title}</p>
                  <p className="event-mini-location">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
          {events.length > 3 && (
            <p className="card-footer-text">+{events.length - 3} mais eventos</p>
          )}
        </div>

        {/* Atalhos Rápidos */}
        <div className="card shortcuts-card">
          <h3>Atalhos Rápidos</h3>
          <div className="shortcuts-grid">
            <button className="shortcut-btn">
              <span className="icon">📋</span>
              <span>Tarefas</span>
            </button>
            <button className="shortcut-btn">
              <span className="icon">📦</span>
              <span>Itens</span>
            </button>
            <button className="shortcut-btn">
              <span className="icon">🌍</span>
              <span>Eventos</span>
            </button>
            <button className="shortcut-btn">
              <span className="icon">💰</span>
              <span>Preços</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
