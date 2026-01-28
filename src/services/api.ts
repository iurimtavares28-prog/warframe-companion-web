import axios, { AxiosInstance } from 'axios'

const WARFRAME_STAT_API = 'https://api.warframestat.us'
const WARFRAME_MARKET_API = 'https://api.warframe.market/v1'

interface CacheEntry {
  data: any
  timestamp: number
}

class WarframeAPIService {
  private warframeStatClient: AxiosInstance
  private marketClient: AxiosInstance
  private cache: Map<string, CacheEntry> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
  private syncInterval: NodeJS.Timeout | null = null

  constructor() {
    this.warframeStatClient = axios.create({
      baseURL: WARFRAME_STAT_API,
      timeout: 10000,
    })

    this.marketClient = axios.create({
      baseURL: WARFRAME_MARKET_API,
      timeout: 10000,
    })
  }

  /**
   * Obter dados completos do worldstate
   */
  async getWorldstate(platform: 'pc' | 'ps4' | 'xbox' | 'switch' = 'pc', language: string = 'pt') {
    return this.fetchWithCache(`worldstate-${platform}-${language}`, async () => {
      const response = await this.warframeStatClient.get(`/${platform}`, {
        params: { language },
      })
      return response.data
    })
  }

  /**
   * Obter alertas
   */
  async getAlerts(platform: 'pc' | 'ps4' | 'xbox' | 'switch' = 'pc', language: string = 'pt') {
    return this.fetchWithCache(`alerts-${platform}-${language}`, async () => {
      const response = await this.warframeStatClient.get(`/${platform}/alerts`, {
        params: { language },
      })
      return response.data
    })
  }

  /**
   * Obter fissuras de void
   */
  async getFissures(platform: 'pc' | 'ps4' | 'xbox' | 'switch' = 'pc', language: string = 'pt') {
    return this.fetchWithCache(`fissures-${platform}-${language}`, async () => {
      const response = await this.warframeStatClient.get(`/${platform}/fissures`, {
        params: { language },
      })
      return response.data
    })
  }

  /**
   * Obter invasões
   */
  async getInvasions(platform: 'pc' | 'ps4' | 'xbox' | 'switch' = 'pc', language: string = 'pt') {
    return this.fetchWithCache(`invasions-${platform}-${language}`, async () => {
      const response = await this.warframeStatClient.get(`/${platform}/invasions`, {
        params: { language },
      })
      return response.data
    })
  }

  /**
   * Obter Nightwave (Série Noturna)
   */
  async getNightwave(platform: 'pc' | 'ps4' | 'xbox' | 'switch' = 'pc', language: string = 'pt') {
    return this.fetchWithCache(`nightwave-${platform}-${language}`, async () => {
      const response = await this.warframeStatClient.get(`/${platform}/nightwave`, {
        params: { language },
      })
      return response.data
    })
  }

  /**
   * Obter Sortie
   */
  async getSortie(platform: 'pc' | 'ps4' | 'xbox' | 'switch' = 'pc', language: string = 'pt') {
    return this.fetchWithCache(`sortie-${platform}-${language}`, async () => {
      const response = await this.warframeStatClient.get(`/${platform}/sortie`, {
        params: { language },
      })
      return response.data
    })
  }

  /**
   * Obter Baro Ki'Teer
   */
  async getBaro(platform: 'pc' | 'ps4' | 'xbox' | 'switch' = 'pc', language: string = 'pt') {
    return this.fetchWithCache(`baro-${platform}-${language}`, async () => {
      const response = await this.warframeStatClient.get(`/${platform}/baro`, {
        params: { language },
      })
      return response.data
    })
  }

  /**
   * Obter itens do mercado
   */
  async getMarketItems() {
    return this.fetchWithCache('market-items', async () => {
      const response = await this.marketClient.get('/items')
      return response.data.payload.items
    })
  }

  /**
   * Obter ordens de um item específico
   */
  async getMarketOrders(urlName: string) {
    return this.fetchWithCache(`market-orders-${urlName}`, async () => {
      const response = await this.marketClient.get(`/items/${urlName}/orders`)
      return response.data.payload.orders
    })
  }

  /**
   * Obter estatísticas de um item
   */
  async getMarketStatistics(urlName: string) {
    return this.fetchWithCache(`market-stats-${urlName}`, async () => {
      const response = await this.marketClient.get(`/items/${urlName}/statistics`)
      return response.data.payload.statistics_live
    })
  }

  /**
   * Buscar itens no mercado
   */
  async searchMarketItems(query: string) {
    try {
      const items = await this.getMarketItems()
      return items.filter((item: any) =>
        item.item_name.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
      return []
    }
  }

  /**
   * Obter preço médio de um item
   */
  async getAveragePrice(urlName: string) {
    try {
      const stats = await this.getMarketStatistics(urlName)
      if (stats && stats.length > 0) {
        return stats[0].avg_price || 0
      }
      return 0
    } catch (error) {
      console.error('Erro ao obter preço médio:', error)
      return 0
    }
  }

  /**
   * Sincronizar dados em tempo real (polling)
   */
  startAutoSync(
    platform: 'pc' | 'ps4' | 'xbox' | 'switch' = 'pc',
    language: string = 'pt',
    interval: number = 5 * 60 * 1000 // 5 minutos
  ) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    this.syncInterval = setInterval(async () => {
      try {
        await this.getWorldstate(platform, language)
        await this.getAlerts(platform, language)
        await this.getFissures(platform, language)
        await this.getInvasions(platform, language)
      } catch (error) {
        console.error('Erro ao sincronizar dados:', error)
      }
    }, interval)
  }

  /**
   * Parar sincronização automática
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  /**
   * Limpar cache
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Limpar cache expirado
   */
  private cleanExpiredCache() {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Buscar dados com cache
   */
  private async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    this.cleanExpiredCache()

    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T
    }

    try {
      const data = await fetcher()
      this.cache.set(key, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error(`Erro ao buscar ${key}:`, error)
      // Retornar dados em cache mesmo que expirados em caso de erro
      if (cached) {
        console.warn(`Usando cache expirado para ${key}`)
        return cached.data as T
      }
      throw error
    }
  }

  /**
   * Obter status de conexão
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await axios.get('https://api.warframestat.us/pc', {
        timeout: 5000,
      })
      return response.status === 200
    } catch (error) {
      return false
    }
  }
}

export const apiService = new WarframeAPIService()
