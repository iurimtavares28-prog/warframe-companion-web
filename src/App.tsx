import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import Checklist from './pages/Checklist'
import Items from './pages/Items'
import Worldstate from './pages/Worldstate'
import TradingAnalytics from './pages/TradingAnalytics'
import RivenExplorer from './pages/RivenExplorer'
import BuildPlanner from './pages/BuildPlanner'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { useAppStore } from './store/appStore'
import { useDataSync } from './hooks/useDataSync'

type Page = 'dashboard' | 'checklist' | 'items' | 'worldstate' | 'trading' | 'rivens' | 'builds' | 'settings' | 'login'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const { settings, isLoading, error, setError, user, isAuthenticated } = useAppStore()
  const { syncData } = useDataSync()

  // Se não está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login />
  }

  // Aplicar tema
  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.style.colorScheme = prefersDark ? 'dark' : 'light'
    } else {
      root.style.colorScheme = settings.theme
    }
  }, [settings.theme])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onSync={syncData} />
      case 'checklist':
        return <Checklist />
      case 'items':
        return <Items />
      case 'worldstate':
        return <Worldstate />
      case 'trading':
        return <TradingAnalytics />
      case 'rivens':
        return <RivenExplorer />
      case 'builds':
        return <BuildPlanner />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard onSync={syncData} />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">⚡ Warframe Companion Pro</h1>
          <p className="app-subtitle">v3.0 - Advanced Features</p>
          {isLoading && <span className="loading-indicator">Syncing...</span>}
        </div>
        <div className="header-user">
          {user && (
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-mastery">Mastery: {user.mastery}</span>
            </div>
          )}
        </div>
      </header>

        {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="app-container">
        <aside className="sidebar">
          <nav className="nav-menu">
            <div className="nav-section">
              <p className="nav-section-title">Essential</p>
              <button
                className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentPage('dashboard')}
              >
                🏠 Dashboard
              </button>
              <button
                className={`nav-item ${currentPage === 'checklist' ? 'active' : ''}`}
                onClick={() => setCurrentPage('checklist')}
              >
                ✓ Tasks
              </button>
              <button
                className={`nav-item ${currentPage === 'items' ? 'active' : ''}`}
                onClick={() => setCurrentPage('items')}
              >
                📦 Items
              </button>
              <button
                className={`nav-item ${currentPage === 'worldstate' ? 'active' : ''}`}
                onClick={() => setCurrentPage('worldstate')}
              >
                🌍 Events
              </button>
            </div>

            <div className="nav-section">
              <p className="nav-section-title">Advanced</p>
              <button
                className={`nav-item ${currentPage === 'trading' ? 'active' : ''}`}
                onClick={() => setCurrentPage('trading')}
              >
                📊 Trading Analytics
              </button>
              <button
                className={`nav-item ${currentPage === 'rivens' ? 'active' : ''}`}
                onClick={() => setCurrentPage('rivens')}
              >
                💎 Riven Explorer
              </button>
              <button
                className={`nav-item ${currentPage === 'builds' ? 'active' : ''}`}
                onClick={() => setCurrentPage('builds')}
              >
                🔨 Build Planner
              </button>
            </div>

            <div className="nav-section">
              <p className="nav-section-title">Other</p>
              <button
                className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
                onClick={() => setCurrentPage('settings')}
              >
                ⚙️ Settings
              </button>
            </div>
          </nav>
        </aside>

        <main className="main-content">
          {renderPage()}
        </main>
      </div>

      <footer className="app-footer">
        <p>© 2026 Warframe Companion Pro | Data provided by WarframeStat.us and Warframe.market</p>
        <p className="footer-note">Version 3.0 - With Login, Trading Analytics, Riven Explorer and Build Planner</p>
      </footer>
    </div>
  )
}

export default App
