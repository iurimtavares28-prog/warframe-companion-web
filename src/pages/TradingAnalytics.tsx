import { useEffect, useState } from 'react'
import '../styles/pages.css'
import { useAppStore } from '../store/appStore'
import { authService } from '../services/auth'

interface TradingStats {
  totalTrades: number
  totalBuys: number
  totalSells: number
  totalSpent: number
  totalEarned: number
  averagePrice: number
  topItems: Array<{ item: string; count: number; avgPrice: number }>
  lastTrade: string | null
}

interface TradingInsights {
  profitMargin: number
  bestSellingItem: string | null
  worstBuyItem: string | null
  tradingTrend: 'increasing' | 'decreasing' | 'stable'
  recommendedPrices: Map<string, { min: number; max: number; avg: number }>
}

export default function TradingAnalytics() {
  const { trades, isLoading, setIsLoading } = useAppStore()
  const [stats, setStats] = useState<TradingStats | null>(null)
  const [insights, setInsights] = useState<TradingInsights | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '7d' | '30d' | '90d'>('all')

  useEffect(() => {
    loadAnalytics()
  }, [selectedPeriod])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const stats = await authService.getTradingStats()
      const insights = await authService.getTradingInsights()
      setStats(stats)
      setInsights(insights)
    } catch (error) {
      console.error('Erro ao carregar análises:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTradesByPeriod = () => {
    const now = Date.now()
    const periodMs = {
      all: Infinity,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    }

    return trades.filter(trade => {
      const tradeTime = new Date(trade.timestamp).getTime()
      return now - tradeTime <= periodMs[selectedPeriod]
    })
  }

  const filteredTrades = filterTradesByPeriod()

  return (
    <div className="page">
      <div className="page-header">
        <h2>Trading Analytics</h2>
        <div className="period-selector">
          {(['all', '7d', '30d', '90d'] as const).map(period => (
            <button
              key={period}
              className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'all' ? 'All Time' : period}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Main Statistics */}
          <div className="analytics-grid">
            <div className="stat-card large">
              <h4>Profit Margin</h4>
              <p className="stat-value">{insights?.profitMargin.toFixed(1)}%</p>
              <p className="stat-subtext">
                {insights && insights.profitMargin > 0 ? 'Profitable ✓' : 'Loss ✗'}
              </p>
            </div>

            <div className="stat-card">
              <h4>Total Trades</h4>
              <p className="stat-value">{stats?.totalTrades || 0}</p>
              <p className="stat-subtext">{stats?.totalBuys || 0} buys, {stats?.totalSells || 0} sells</p>
            </div>

            <div className="stat-card">
              <h4>Total Spent</h4>
              <p className="stat-value">{(stats?.totalSpent || 0).toLocaleString()}p</p>
              <p className="stat-subtext">On purchases</p>
            </div>

            <div className="stat-card">
              <h4>Total Earned</h4>
              <p className="stat-value">{(stats?.totalEarned || 0).toLocaleString()}p</p>
              <p className="stat-subtext">From sales</p>
            </div>

            <div className="stat-card">
              <h4>Average Price</h4>
              <p className="stat-value">{(stats?.averagePrice || 0).toFixed(0)}p</p>
              <p className="stat-subtext">Per transaction</p>
            </div>

            <div className="stat-card">
              <h4>Trend</h4>
              <p className="stat-value">
                {insights?.tradingTrend === 'increasing' ? '📈' : insights?.tradingTrend === 'decreasing' ? '📉' : '➡️'}
              </p>
              <p className="stat-subtext">
                {insights?.tradingTrend === 'increasing'
                  ? 'More sales'
                  : insights?.tradingTrend === 'decreasing'
                    ? 'More buys'
                    : 'Stable'}
              </p>
            </div>
          </div>

          {/* Insights */}
          <div className="insights-section">
            <h3>Trading Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>Best Item to Sell</h4>
                <p className="insight-value">{insights?.bestSellingItem || 'N/A'}</p>
                <p className="insight-text">Most sold in period</p>
              </div>

              <div className="insight-card">
                <h4>Worst Item to Buy</h4>
                <p className="insight-value">{insights?.worstBuyItem || 'N/A'}</p>
                <p className="insight-text">Highest price paid</p>
              </div>
            </div>
          </div>

          {/* Top Items */}
          <div className="card">
            <h3>Top Traded Items</h3>
            <div className="table-container">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Average Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.topItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item}</td>
                      <td>{item.count}</td>
                      <td>{item.avgPrice.toFixed(0)}p</td>
                      <td>{(item.count * item.avgPrice).toFixed(0)}p</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade History */}
          <div className="card">
            <h3>Trade History ({filteredTrades.length})</h3>
            <div className="trades-list">
              {filteredTrades.length > 0 ? (
                filteredTrades.map(trade => (
                  <div key={trade.id} className={`trade-item ${trade.type}`}>
                    <div className="trade-header">
                      <span className="trade-type">{trade.type === 'buy' ? '📥 Buy' : '📤 Sell'}</span>
                      <span className="trade-item-name">{trade.item}</span>
                      <span className="trade-price">{trade.price}p × {trade.quantity}</span>
                    </div>
                    <div className="trade-details">
                      <span className="trade-trader">Trader: {trade.trader}</span>
                      <span className="trade-date">{new Date(trade.timestamp).toLocaleDateString('en-US')}</span>
                      <span className={`trade-status ${trade.status}`}>{trade.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No trades in selected period</p>
              )}
            </div>
          </div>

          {/* Recommended Prices */}
          <div className="card">
            <h3>Recommended Prices</h3>
            <div className="prices-grid">
              {Array.from(insights?.recommendedPrices || []).slice(0, 5).map(([item, prices]) => (
                <div key={item} className="price-card">
                  <h4>{item}</h4>
                  <div className="price-range">
                    <p>Minimum: <strong>{prices.min.toFixed(0)}p</strong></p>
                    <p>Average: <strong>{prices.avg.toFixed(0)}p</strong></p>
                    <p>Maximum: <strong>{prices.max.toFixed(0)}p</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
