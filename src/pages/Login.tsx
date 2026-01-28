import { useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { authService } from '../services/auth'
import '../styles/pages.css'

export default function Login() {
  const { setUser, setIsAuthenticated } = useAppStore()

  useEffect(() => {
    // Check if there's an OAuth callback
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      handleOAuthCallback(code)
    }
  }, [])

  const handleOAuthCallback = async (code: string) => {
    try {
      const token = await authService.handleOAuthCallback(code)
      setUser(token.user)
      setIsAuthenticated(true)
      window.location.href = '/'
    } catch (error) {
      console.error('Error processing login:', error)
    }
  }

  const handleLoginClick = () => {
    authService.initiateOAuth()
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>⚡ Warframe Companion Pro</h1>
          <p>Version 3.0 - Advanced Features</p>
        </div>

        <div className="login-card">
          <h2>Welcome, Tenno!</h2>
          <p className="login-subtitle">
            Sign in with your Warframe account to sync your data and enjoy all features.
          </p>

          <button className="btn-login-warframe" onClick={handleLoginClick}>
            <span className="login-icon">🎮</span>
            Sign in with Warframe Account
          </button>

          <div className="login-benefits">
            <h3>Login Benefits:</h3>
            <ul>
              <li>✅ Automatically sync your inventory</li>
              <li>✅ Synced trade history</li>
              <li>✅ Access your data on any device</li>
              <li>✅ Advanced trading analytics</li>
              <li>✅ Personalized recommendations</li>
              <li>✅ Community and build sharing</li>
            </ul>
          </div>

          <div className="login-info">
            <p className="info-text">
              Your privacy matters. We never share your data with third parties.
            </p>
            <p className="info-text">
              <a href="#privacy">Privacy Policy</a> | <a href="#terms">Terms of Service</a>
            </p>
          </div>
        </div>

        <div className="login-features">
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h4>Trading Analytics</h4>
            <p>Advanced analysis of your trade history</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">💎</span>
            <h4>Riven Explorer</h4>
            <p>Manage and analyze your rivens</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🔨</span>
            <h4>Build Planner</h4>
            <p>Create and share optimized builds</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h4>Farm Optimizer</h4>
            <p>Automatic farming routes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
