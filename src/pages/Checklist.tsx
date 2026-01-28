import { useState } from 'react'
import '../styles/pages.css'
import { useAppStore } from '../store/appStore'

export default function Checklist() {
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily')
  const { tasks, toggleTask } = useAppStore()

  const filteredTasks = tasks.filter(t => t.category === tab)
  const completedCount = filteredTasks.filter(t => t.completed).length
  const completionRate = filteredTasks.length > 0 ? (completedCount / filteredTasks.length) * 100 : 0

  return (
    <div className="page">
      <h2>Checklist de Tarefas</h2>

      <div className="tabs">
        <button
          className={`tab ${tab === 'daily' ? 'active' : ''}`}
          onClick={() => setTab('daily')}
        >
          Diárias ({tasks.filter(t => t.category === 'daily').length})
        </button>
        <button
          className={`tab ${tab === 'weekly' ? 'active' : ''}`}
          onClick={() => setTab('weekly')}
        >
          Semanais ({tasks.filter(t => t.category === 'weekly').length})
        </button>
      </div>

      <div className="card">
        <div className="progress-section">
          <h3>Progresso: {completionRate.toFixed(0)}%</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
          </div>
          <p className="progress-text">{completedCount} de {filteredTasks.length} concluídas</p>
        </div>

        <div className="task-list">
          {filteredTasks.map(task => (
            <div key={task.id} className={`task-item-detailed ${task.completed ? 'completed' : ''}`}>
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
              </div>
              <div className="task-info">
                <h4>{task.title}</h4>
                <p className="task-reward">Recompensa: {task.reward || 'Desconhecida'}</p>
              </div>
              <div className="task-meta">
                <span className="expiry">Expira: {task.expiry}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma tarefa {tab === 'daily' ? 'diária' : 'semanal'} no momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}
