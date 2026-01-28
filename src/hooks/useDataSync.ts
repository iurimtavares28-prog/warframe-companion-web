import { useEffect, useCallback } from 'react'
import { apiService } from '../services/api'
import { useAppStore } from '../store/appStore'

export function useDataSync() {
  const { settings, setEvents, setIsLoading, setError, setLastSync } = useAppStore()

  const syncData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [alerts, fissures, invasions] = await Promise.all([
        apiService.getAlerts(settings.platform, settings.language),
        apiService.getFissures(settings.platform, settings.language),
        apiService.getInvasions(settings.platform, settings.language),
      ])

      // Combinar eventos
      const events = [
        ...(alerts || []).map((alert: any) => ({
          id: alert.id || Math.random().toString(),
          title: alert.mission?.type || 'Alerta',
          type: 'alert' as const,
          location: alert.mission?.location || 'Desconhecido',
          reward: alert.mission?.reward?.asString || 'Desconhecido',
          expiry: new Date(alert.expiry).toLocaleTimeString('pt-PT'),
          active: true,
        })),
        ...(fissures || []).map((fissure: any) => ({
          id: fissure.id || Math.random().toString(),
          title: `Fissura: ${fissure.missionType}`,
          type: 'fissure' as const,
          location: fissure.location || 'Desconhecido',
          reward: 'Relics',
          expiry: new Date(fissure.expiry).toLocaleTimeString('pt-PT'),
          active: true,
        })),
        ...(invasions || []).map((invasion: any) => ({
          id: invasion.id || Math.random().toString(),
          title: `Invasão: ${invasion.attackingFaction} vs ${invasion.defendingFaction}`,
          type: 'invasion' as const,
          location: invasion.location || 'Desconhecido',
          reward: 'Recursos',
          expiry: `${invasion.percentComplete}% completa`,
          active: true,
        })),
      ]

      setEvents(events)
      setLastSync(Date.now())
      setError(null)
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error)
      setError('Erro ao carregar dados. Usando dados em cache.')
    } finally {
      setIsLoading(false)
    }
  }, [settings.platform, settings.language, setEvents, setIsLoading, setError, setLastSync])

  useEffect(() => {
    // Sincronizar dados ao montar
    syncData()

    // Iniciar sincronização automática a cada 5 minutos
    apiService.startAutoSync(settings.platform, settings.language, 5 * 60 * 1000)

    return () => {
      apiService.stopAutoSync()
    }
  }, [syncData, settings.platform, settings.language])

  return { syncData }
}
