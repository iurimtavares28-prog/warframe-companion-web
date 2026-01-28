import { useState } from 'react'
import '../styles/pages.css'
import { useAppStore } from '../store/appStore'

export default function RivenExplorer() {
  const { rivens, addRiven, updateRiven, deleteRiven } = useAppStore()
  const [filterWeapon, setFilterWeapon] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'rank' | 'stats'>('price')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRiven, setNewRiven] = useState({
    weapon: '',
    stats: [] as string[],
    rank: 0,
    price: 0,
  })

  const filteredRivens = rivens
    .filter(r => r.weapon.toLowerCase().includes(filterWeapon.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price') return (b.price || 0) - (a.price || 0)
      if (sortBy === 'rank') return b.rank - a.rank
      return b.stats.length - a.stats.length
    })

  const handleAddRiven = () => {
    if (newRiven.weapon && newRiven.stats.length > 0) {
      addRiven({
        id: Math.random().toString(36).substr(2, 9),
        ...newRiven,
        listed: false,
      })
      setNewRiven({ weapon: '', stats: [], rank: 0, price: 0 })
      setShowAddForm(false)
    }
  }

  const totalValue = rivens.reduce((sum, r) => sum + (r.price || 0), (0))
  const listedCount = rivens.filter(r => r.listed).length

  return (
    <div className="page">
      <div className="page-header">
        <h2>Riven Explorer</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancelar' : '+ Adicionar Riven'}
        </button>
      </div>

      {/* Estatísticas */}
      <div className="stats-row">
        <div className="stat-mini">
          <span className="stat-icon">💎</span>
          <div>
            <p className="stat-label">Total de Rivens</p>
            <p className="stat-number">{rivens.length}</p>
          </div>
        </div>
        <div className="stat-mini">
          <span className="stat-icon">📊</span>
          <div>
            <p className="stat-label">Valor Total</p>
            <p className="stat-number">{totalValue.toLocaleString()}p</p>
          </div>
        </div>
        <div className="stat-mini">
          <span className="stat-icon">📤</span>
          <div>
            <p className="stat-label">Listados</p>
            <p className="stat-number">{listedCount}</p>
          </div>
        </div>
        <div className="stat-mini">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-label">Não Listados</p>
            <p className="stat-number">{rivens.length - listedCount}</p>
          </div>
        </div>
      </div>

      {/* Formulário de Adição */}
      {showAddForm && (
        <div className="card form-card">
          <h3>Adicionar Novo Riven</h3>
          <div className="form-group">
            <label>Arma</label>
            <input
              type="text"
              placeholder="Ex: Soma Prime"
              value={newRiven.weapon}
              onChange={(e) => setNewRiven({ ...newRiven, weapon: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Stats (separadas por vírgula)</label>
            <input
              type="text"
              placeholder="Ex: +120% Damage, +80% Crit"
              value={newRiven.stats.join(', ')}
              onChange={(e) =>
                setNewRiven({ ...newRiven, stats: e.target.value.split(',').map(s => s.trim()) })
              }
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rank</label>
              <input
                type="number"
                min="0"
                max="40"
                value={newRiven.rank}
                onChange={(e) => setNewRiven({ ...newRiven, rank: parseInt(e.target.value) })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Preço (Platina)</label>
              <input
                type="number"
                min="0"
                value={newRiven.price}
                onChange={(e) => setNewRiven({ ...newRiven, price: parseInt(e.target.value) })}
                className="form-input"
              />
            </div>
          </div>

          <button className="btn-primary" onClick={handleAddRiven}>
            Adicionar Riven
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar por arma..."
          value={filterWeapon}
          onChange={(e) => setFilterWeapon(e.target.value)}
          className="search-input"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="filter-select"
        >
          <option value="price">Ordenar por Preço</option>
          <option value="rank">Ordenar por Rank</option>
          <option value="stats">Ordenar por Stats</option>
        </select>
      </div>

      {/* Lista de Rivens */}
      <div className="rivens-grid">
        {filteredRivens.map(riven => (
          <div key={riven.id} className={`riven-card ${riven.listed ? 'listed' : ''}`}>
            <div className="riven-header">
              <h4>{riven.weapon}</h4>
              <span className={`riven-status ${riven.listed ? 'listed' : 'unlisted'}`}>
                {riven.listed ? '📤 Listado' : '📦 Não Listado'}
              </span>
            </div>

            <div className="riven-stats">
              <p className="rank-badge">Rank: {riven.rank}/40</p>
              <div className="stats-list">
                {riven.stats.map((stat, index) => (
                  <p key={index} className="stat-item">✓ {stat}</p>
                ))}
              </div>
            </div>

            <div className="riven-footer">
              <p className="riven-price">{riven.price}p</p>
              <div className="riven-actions">
                <button
                  className="btn-icon"
                  onClick={() =>
                    updateRiven(riven.id, { listed: !riven.listed })
                  }
                  title={riven.listed ? 'Deslistar' : 'Listar'}
                >
                  {riven.listed ? '📥' : '📤'}
                </button>
                <button
                  className="btn-icon danger"
                  onClick={() => deleteRiven(riven.id)}
                  title="Deletar"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRivens.length === 0 && (
        <div className="empty-state">
          <p>Nenhum riven encontrado. Adicione um novo riven para começar!</p>
        </div>
      )}
    </div>
  )
}
