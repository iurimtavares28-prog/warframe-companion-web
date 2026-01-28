import { useState } from 'react'
import '../styles/pages.css'
import { useAppStore } from '../store/appStore'

export default function Settings() {
  const { settings, updateSettings, updateNotificationSettings } = useAppStore()
  const [saved, setSaved] = useState(false)

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    updateSettings({ theme })
  }

  const handleNotificationToggle = (key: keyof typeof settings.notifications) => {
    updateNotificationSettings(key, !settings.notifications[key])
  }

  const handlePlatformChange = (platform: 'pc' | 'ps4' | 'xbox' | 'switch') => {
    updateSettings({ platform })
  }

  const handleLanguageChange = (language: string) => {
    updateSettings({ language })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page">
      <h2>Definições</h2>

      {saved && (
        <div className="success-banner">
          <span>✓ Alterações salvas com sucesso!</span>
        </div>
      )}

      <div className="settings-sections">
        {/* Tema */}
        <div className="settings-section">
          <h3>Aparência</h3>
          <div className="settings-group">
            <label>Tema</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={settings.theme === 'light'}
                  onChange={() => handleThemeChange('light')}
                />
                <span>Claro</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={settings.theme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                />
                <span>Escuro</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="theme"
                  value="auto"
                  checked={settings.theme === 'auto'}
                  onChange={() => handleThemeChange('auto')}
                />
                <span>Automático</span>
              </label>
            </div>
          </div>
        </div>

        {/* Plataforma */}
        <div className="settings-section">
          <h3>Jogo</h3>
          <div className="settings-group">
            <label>Plataforma</label>
            <select
              value={settings.platform}
              onChange={(e) => handlePlatformChange(e.target.value as any)}
              className="settings-select"
            >
              <option value="pc">PC</option>
              <option value="ps4">PlayStation 4</option>
              <option value="xbox">Xbox</option>
              <option value="switch">Nintendo Switch</option>
            </select>
          </div>

          <div className="settings-group">
            <label>Idioma</label>
            <select
              value={settings.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="settings-select"
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        {/* Notificações */}
        <div className="settings-section">
          <h3>Notificações</h3>
          <div className="notifications-list">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.tasks}
                onChange={() => handleNotificationToggle('tasks')}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">Tarefas Expirando</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.events}
                onChange={() => handleNotificationToggle('events')}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">Novos Eventos</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.baro}
                onChange={() => handleNotificationToggle('baro')}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">Baro Ki'Teer</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.fissures}
                onChange={() => handleNotificationToggle('fissures')}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">Fissuras de Void</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.invasions}
                onChange={() => handleNotificationToggle('invasions')}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">Invasões</span>
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.notifications.alerts}
                onChange={() => handleNotificationToggle('alerts')}
              />
              <span className="toggle-switch"></span>
              <span className="toggle-text">Alertas</span>
            </label>
          </div>
        </div>

        {/* Informações */}
        <div className="settings-section">
          <h3>Sobre</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Versão:</span>
              <span className="info-value">2.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Plataforma:</span>
              <span className="info-value">Web PWA</span>
            </div>
            <div className="info-item">
              <span className="info-label">Dados fornecidos por:</span>
              <span className="info-value">WarframeStat.us e Warframe.market</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value">✓ Totalmente Funcional</span>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn-primary" onClick={handleSave}>Salvar Alterações</button>
            <button className="btn-secondary">Restaurar Padrões</button>
          </div>
        </div>

        {/* PWA */}
        <div className="settings-section">
          <h3>Aplicação</h3>
          <p className="info-text">Esta é uma Progressive Web App (PWA). Pode ser instalada como aplicação nativa no seu dispositivo.</p>
          <button className="btn-secondary" id="install-btn" style={{ display: 'none' }}>
            Instalar App
          </button>
          <p className="info-text" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted)', marginTop: '1rem' }}>
            Clique no ícone de instalação no navegador para adicionar à sua tela inicial.
          </p>
        </div>
      </div>
    </div>
  )
}
