import { useState } from 'react'
import '../styles/pages.css'
import { useAppStore } from '../store/appStore'

export default function Items() {
  const [filterType, setFilterType] = useState<'all' | 'warframe' | 'weapon' | 'companion'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'mastered' | 'owned' | 'missing'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { items } = useAppStore()

  let filtered = items
    .filter(item => filterType === 'all' || item.type === filterType)
    .filter(item => filterStatus === 'all' || item.status === filterStatus)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const masteredCount = items.filter(i => i.status === 'mastered').length
  const ownedCount = items.filter(i => i.status === 'owned').length
  const missingCount = items.filter(i => i.status === 'missing').length
  const totalMasteryXP = items
    .filter(i => i.status === 'mastered')
    .reduce((sum, i) => sum + i.masteryXP, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered':
        return '#22c55e'
      case 'owned':
        return '#3b82f6'
      case 'missing':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'mastered':
        return '✓ Dominado'
      case 'owned':
        return '◐ Possuído'
      case 'missing':
        return '✗ Faltando'
      default:
        return status
    }
  }

  return (
    <div className="page">
      <h2>Rastreador de Itens</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Dominados</h4>
          <p className="stat-value">{masteredCount}</p>
          <p className="stat-subtext">XP: {totalMasteryXP.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h4>Possuídos</h4>
          <p className="stat-value">{ownedCount}</p>
          <p className="stat-subtext">Não dominados</p>
        </div>
        <div className="stat-card">
          <h4>Faltando</h4>
          <p className="stat-value">{missingCount}</p>
          <p className="stat-subtext">Para coletar</p>
        </div>
        <div className="stat-card">
          <h4>Progresso</h4>
          <p className="stat-value">{((masteredCount / items.length) * 100).toFixed(0)}%</p>
          <p className="stat-subtext">Completo</p>
        </div>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar itens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="filter-group">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Todos os Tipos</option>
            <option value="warframe">Warframes</option>
            <option value="weapon">Armas</option>
            <option value="companion">Companheiros</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Todos os Status</option>
            <option value="mastered">Dominados</option>
            <option value="owned">Possuídos</option>
            <option value="missing">Faltando</option>
          </select>
        </div>
      </div>

      <div className="items-grid">
        {filtered.map(item => (
          <div key={item.id} className="item-card">
            <div className="item-header">
              <h4>{item.name}</h4>
              <span
                className="item-status"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {getStatusLabel(item.status)}
              </span>
            </div>
            <div className="item-details">
              <p><strong>Tipo:</strong> {item.type === 'warframe' ? 'Warframe' : item.type === 'weapon' ? 'Arma' : 'Companheiro'}</p>
              <p><strong>Raridade:</strong> {item.rarity}</p>
              <p><strong>Mastery XP:</strong> {item.masteryXP}</p>
              {item.price && item.price > 0 && (
                <p><strong>Preço:</strong> {item.price}p</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>Nenhum item encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}
