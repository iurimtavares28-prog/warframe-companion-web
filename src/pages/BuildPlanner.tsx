import { useState } from 'react'
import '../styles/pages.css'
import { useAppStore } from '../store/appStore'

export default function BuildPlanner() {
  const { builds, addBuild, deleteBuild } = useAppStore()
  const [filterWarframe, setFilterWarframe] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'recent'>('rating')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBuild, setNewBuild] = useState({
    name: '',
    warframe: '',
    mods: [] as string[],
    description: '',
    difficulty: 'intermediate' as const,
  })

  const filteredBuilds = builds
    .filter(b => b.warframe.toLowerCase().includes(filterWarframe.toLowerCase()))
    .filter(b => filterDifficulty === 'all' || b.difficulty === filterDifficulty)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'downloads') return b.downloads - a.downloads
      return 0
    })

  const handleAddBuild = () => {
    if (newBuild.name && newBuild.warframe && newBuild.mods.length > 0) {
      addBuild({
        id: Math.random().toString(36).substr(2, 9),
        ...newBuild,
        author: 'Você',
        rating: 0,
        downloads: 0,
      })
      setNewBuild({
        name: '',
        warframe: '',
        mods: [],
        description: '',
        difficulty: 'intermediate',
      })
      setShowAddForm(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#22c55e'
      case 'intermediate':
        return '#f59e0b'
      case 'advanced':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Iniciante'
      case 'intermediate':
        return 'Intermediário'
      case 'advanced':
        return 'Avançado'
      default:
        return difficulty
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Build Planner</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancelar' : '+ Criar Build'}
        </button>
      </div>

      {/* Estatísticas */}
      <div className="stats-row">
        <div className="stat-mini">
          <span className="stat-icon">🔨</span>
          <div>
            <p className="stat-label">Total de Builds</p>
            <p className="stat-number">{builds.length}</p>
          </div>
        </div>
        <div className="stat-mini">
          <span className="stat-icon">⭐</span>
          <div>
            <p className="stat-label">Média de Rating</p>
            <p className="stat-number">
              {builds.length > 0 ? (builds.reduce((sum, b) => sum + b.rating, 0) / builds.length).toFixed(1) : '0'}
            </p>
          </div>
        </div>
        <div className="stat-mini">
          <span className="stat-icon">📥</span>
          <div>
            <p className="stat-label">Total Downloads</p>
            <p className="stat-number">{builds.reduce((sum, b) => sum + b.downloads, 0)}</p>
          </div>
        </div>
      </div>

      {/* Formulário de Criação */}
      {showAddForm && (
        <div className="card form-card">
          <h3>Criar Novo Build</h3>
          <div className="form-group">
            <label>Nome do Build</label>
            <input
              type="text"
              placeholder="Ex: Excalibur Exalted Blade"
              value={newBuild.name}
              onChange={(e) => setNewBuild({ ...newBuild, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Warframe</label>
            <input
              type="text"
              placeholder="Ex: Excalibur"
              value={newBuild.warframe}
              onChange={(e) => setNewBuild({ ...newBuild, warframe: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Mods (separados por vírgula)</label>
            <textarea
              placeholder="Ex: Exalted Blade, Blind Rage, Transient Fortitude"
              value={newBuild.mods.join(', ')}
              onChange={(e) =>
                setNewBuild({ ...newBuild, mods: e.target.value.split(',').map(m => m.trim()) })
              }
              className="form-input"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              placeholder="Descreva o build e seus benefícios..."
              value={newBuild.description}
              onChange={(e) => setNewBuild({ ...newBuild, description: e.target.value })}
              className="form-input"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Dificuldade</label>
            <select
              value={newBuild.difficulty}
              onChange={(e) =>
                setNewBuild({ ...newBuild, difficulty: e.target.value as any })
              }
              className="form-input"
            >
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermediário</option>
              <option value="advanced">Avançado</option>
            </select>
          </div>

          <button className="btn-primary" onClick={handleAddBuild}>
            Criar Build
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar por Warframe..."
          value={filterWarframe}
          onChange={(e) => setFilterWarframe(e.target.value)}
          className="search-input"
        />

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value as any)}
          className="filter-select"
        >
          <option value="all">Todas as Dificuldades</option>
          <option value="beginner">Iniciante</option>
          <option value="intermediate">Intermediário</option>
          <option value="advanced">Avançado</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="filter-select"
        >
          <option value="rating">Ordenar por Rating</option>
          <option value="downloads">Ordenar por Downloads</option>
          <option value="recent">Mais Recentes</option>
        </select>
      </div>

      {/* Lista de Builds */}
      <div className="builds-grid">
        {filteredBuilds.map(build => (
          <div key={build.id} className="build-card">
            <div className="build-header">
              <div>
                <h4>{build.name}</h4>
                <p className="build-warframe">{build.warframe}</p>
              </div>
              <span
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(build.difficulty) }}
              >
                {getDifficultyLabel(build.difficulty)}
              </span>
            </div>

            <p className="build-description">{build.description}</p>

            <div className="build-mods">
              <p className="mods-label">Mods:</p>
              <div className="mods-list">
                {build.mods.map((mod, index) => (
                  <span key={index} className="mod-tag">
                    {mod}
                  </span>
                ))}
              </div>
            </div>

            <div className="build-stats">
              <span className="stat">⭐ {build.rating.toFixed(1)}</span>
              <span className="stat">📥 {build.downloads}</span>
              <span className="stat">✍️ {build.author}</span>
            </div>

            <div className="build-actions">
              <button className="btn-secondary">👁️ Visualizar</button>
              <button className="btn-secondary">❤️ Favoritar</button>
              {build.author === 'Você' && (
                <button
                  className="btn-danger"
                  onClick={() => deleteBuild(build.id)}
                >
                  🗑️ Deletar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBuilds.length === 0 && (
        <div className="empty-state">
          <p>Nenhum build encontrado. Crie um novo build para começar!</p>
        </div>
      )}
    </div>
  )
}
