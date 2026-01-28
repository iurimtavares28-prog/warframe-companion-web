import axios, { AxiosInstance } from 'axios'

interface WarframeUser {
  id: string
  username: string
  platform: 'pc' | 'ps4' | 'xbox' | 'switch'
  mastery: number
  playtime: number
  lastLogin: string
  avatar?: string
}

interface TradeRecord {
  id: string
  item: string
  quantity: number
  price: number
  type: 'buy' | 'sell'
  trader: string
  timestamp: string
  platform: string
  status: 'completed' | 'pending' | 'cancelled'
}

interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: WarframeUser
}

class WarframeAuthService {
  private apiClient: AxiosInstance
  private readonly OAUTH_CLIENT_ID = 'warframe-companion-pro'
  private readonly OAUTH_REDIRECT_URI = `${window.location.origin}/auth/callback`
  private readonly WARFRAME_AUTH_URL = 'https://api.warframestat.us/oauth'
  private readonly LOCAL_STORAGE_KEY = 'warframe_auth_token'
  private readonly TRADES_STORAGE_KEY = 'warframe_trades_history'

  constructor() {
    this.apiClient = axios.create({
      timeout: 10000,
    })
  }

  /**
   * Iniciar fluxo de autenticação OAuth
   */
  initiateOAuth() {
    const params = new URLSearchParams({
      client_id: this.OAUTH_CLIENT_ID,
      redirect_uri: this.OAUTH_REDIRECT_URI,
      response_type: 'code',
      scope: 'profile inventory trades',
    })

    window.location.href = `${this.WARFRAME_AUTH_URL}/authorize?${params.toString()}`
  }

  /**
   * Processar callback OAuth
   */
  async handleOAuthCallback(code: string): Promise<AuthToken> {
    try {
      const response = await this.apiClient.post(`${this.WARFRAME_AUTH_URL}/token`, {
        client_id: this.OAUTH_CLIENT_ID,
        code,
        redirect_uri: this.OAUTH_REDIRECT_URI,
      })

      const token: AuthToken = response.data
      this.saveToken(token)
      return token
    } catch (error) {
      console.error('Erro ao processar callback OAuth:', error)
      throw new Error('Falha na autenticação')
    }
  }

  /**
   * Obter utilizador autenticado
   */
  getAuthenticatedUser(): WarframeUser | null {
    const token = this.getToken()
    return token ? token.user : null
  }

  /**
   * Obter token de acesso
   */
  getAccessToken(): string | null {
    const token = this.getToken()
    return token ? token.accessToken : null
  }

  /**
   * Verificar se está autenticado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY)
    localStorage.removeItem(this.TRADES_STORAGE_KEY)
  }

  /**
   * Obter histórico de trades
   */
  async getTradeHistory(limit: number = 100): Promise<TradeRecord[]> {
    const token = this.getAccessToken()
    if (!token) {
      return this.getLocalTradeHistory()
    }

    try {
      const response = await this.apiClient.get('/api/trades/history', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit },
      })

      const trades: TradeRecord[] = response.data
      this.saveTradeHistory(trades)
      return trades
    } catch (error) {
      console.error('Erro ao obter histórico de trades:', error)
      return this.getLocalTradeHistory()
    }
  }

  /**
   * Adicionar trade ao histórico
   */
  async addTrade(trade: Omit<TradeRecord, 'id' | 'timestamp'>): Promise<TradeRecord> {
    const newTrade: TradeRecord = {
      ...trade,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }

    const token = this.getAccessToken()
    if (token) {
      try {
        const response = await this.apiClient.post('/api/trades', newTrade, {
          headers: { Authorization: `Bearer ${token}` },
        })
        return response.data
      } catch (error) {
        console.error('Erro ao adicionar trade:', error)
      }
    }

    // Salvar localmente se não conseguir sincronizar
    const trades = this.getLocalTradeHistory()
    trades.unshift(newTrade)
    this.saveTradeHistory(trades)
    return newTrade
  }

  /**
   * Obter estatísticas de trading
   */
  async getTradingStats() {
    const trades = await this.getTradeHistory()

    const stats = {
      totalTrades: trades.length,
      totalBuys: trades.filter(t => t.type === 'buy').length,
      totalSells: trades.filter(t => t.type === 'sell').length,
      totalSpent: trades
        .filter(t => t.type === 'buy')
        .reduce((sum, t) => sum + t.price * t.quantity, 0),
      totalEarned: trades
        .filter(t => t.type === 'sell')
        .reduce((sum, t) => sum + t.price * t.quantity, 0),
      averagePrice: 0,
      topItems: [] as Array<{ item: string; count: number; avgPrice: number }>,
      lastTrade: trades[0]?.timestamp || null,
    }

    // Calcular preço médio
    if (trades.length > 0) {
      const totalValue = trades.reduce((sum, t) => sum + t.price * t.quantity, 0)
      const totalQuantity = trades.reduce((sum, t) => sum + t.quantity, 0)
      stats.averagePrice = totalQuantity > 0 ? totalValue / totalQuantity : 0
    }

    // Top items
    const itemMap = new Map<string, { count: number; totalPrice: number }>()
    trades.forEach(trade => {
      const existing = itemMap.get(trade.item) || { count: 0, totalPrice: 0 }
      itemMap.set(trade.item, {
        count: existing.count + trade.quantity,
        totalPrice: existing.totalPrice + trade.price * trade.quantity,
      })
    })

    stats.topItems = Array.from(itemMap.entries())
      .map(([item, data]) => ({
        item,
        count: data.count,
        avgPrice: data.totalPrice / data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return stats
  }

  /**
   * Obter insights de trading
   */
  async getTradingInsights() {
    const stats = await this.getTradingStats()
    const trades = await this.getTradeHistory()

    const insights = {
      profitMargin: 0,
      bestSellingItem: null as string | null,
      worstBuyItem: null as string | null,
      tradingTrend: 'stable' as 'increasing' | 'decreasing' | 'stable',
      recommendedPrices: new Map<string, { min: number; max: number; avg: number }>(),
    }

    // Calcular margem de lucro
    if (stats.totalEarned > 0 && stats.totalSpent > 0) {
      insights.profitMargin = ((stats.totalEarned - stats.totalSpent) / stats.totalSpent) * 100
    }

    // Melhor item para vender
    if (stats.topItems.length > 0) {
      insights.bestSellingItem = stats.topItems[0].item
    }

    // Pior item para comprar
    const buyTrades = trades.filter(t => t.type === 'buy')
    if (buyTrades.length > 0) {
      const itemPrices = new Map<string, number[]>()
      buyTrades.forEach(trade => {
        const prices = itemPrices.get(trade.item) || []
        prices.push(trade.price)
        itemPrices.set(trade.item, prices)
      })

      let worstItem = null
      let highestAvgPrice = 0
      itemPrices.forEach((prices, item) => {
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length
        if (avg > highestAvgPrice) {
          highestAvgPrice = avg
          worstItem = item
        }
      })
      insights.worstBuyItem = worstItem
    }

    // Tendência de trading
    const recentTrades = trades.slice(0, 20)
    const recentSells = recentTrades.filter(t => t.type === 'sell').length
    const recentBuys = recentTrades.filter(t => t.type === 'buy').length
    if (recentSells > recentBuys * 1.2) {
      insights.tradingTrend = 'increasing'
    } else if (recentBuys > recentSells * 1.2) {
      insights.tradingTrend = 'decreasing'
    }

    // Preços recomendados
    const priceMap = new Map<string, number[]>()
    trades.forEach(trade => {
      const prices = priceMap.get(trade.item) || []
      prices.push(trade.price)
      priceMap.set(trade.item, prices)
    })

    priceMap.forEach((prices, item) => {
      const sorted = prices.sort((a, b) => a - b)
      const min = sorted[0]
      const max = sorted[sorted.length - 1]
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length
      insights.recommendedPrices.set(item, { min, max, avg })
    })

    return insights
  }

  /**
   * Salvar token
   */
  private saveToken(token: AuthToken) {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(token))
  }

  /**
   * Obter token
   */
  private getToken(): AuthToken | null {
    const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY)
    if (!stored) return null

    try {
      const token = JSON.parse(stored) as AuthToken
      // Verificar se expirou
      if (Date.now() > token.expiresIn) {
        this.logout()
        return null
      }
      return token
    } catch {
      return null
    }
  }

  /**
   * Salvar histórico de trades localmente
   */
  private saveTradeHistory(trades: TradeRecord[]) {
    localStorage.setItem(this.TRADES_STORAGE_KEY, JSON.stringify(trades))
  }

  /**
   * Obter histórico de trades local
   */
  private getLocalTradeHistory(): TradeRecord[] {
    const stored = localStorage.getItem(this.TRADES_STORAGE_KEY)
    if (!stored) return []

    try {
      return JSON.parse(stored) as TradeRecord[]
    } catch {
      return []
    }
  }
}

export const authService = new WarframeAuthService()
