import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WarframeUser {
  id: string
  username: string
  platform: 'pc' | 'ps4' | 'xbox' | 'switch'
  mastery: number
  playtime: number
  lastLogin: string
  avatar?: string
}

export interface TradeRecord {
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

export interface Riven {
  id: string
  weapon: string
  stats: string[]
  rank: number
  price?: number
  listed: boolean
}

export interface Build {
  id: string
  name: string
  warframe: string
  mods: string[]
  description: string
  author: string
  rating: number
  downloads: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface Task {
  id: string
  title: string
  category: 'daily' | 'weekly'
  completed: boolean
  expiry: string
  reward?: string
}

export interface Item {
  id: string
  name: string
  type: 'warframe' | 'weapon' | 'companion'
  masteryXP: number
  rarity: string
  status: 'mastered' | 'owned' | 'missing'
  price?: number
}

export interface Event {
  id: string
  title: string
  type: 'alert' | 'fissure' | 'invasion' | 'event'
  location?: string
  reward?: string
  expiry: string
  active: boolean
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    tasks: boolean
    events: boolean
    baro: boolean
    fissures: boolean
    invasions: boolean
    alerts: boolean
    trades: boolean
  }
  language: string
  platform: 'pc' | 'ps4' | 'xbox' | 'switch'
}

interface AppState {
  // Auth
  user: WarframeUser | null
  isAuthenticated: boolean
  setUser: (user: WarframeUser | null) => void
  setIsAuthenticated: (authenticated: boolean) => void

  // Trades
  trades: TradeRecord[]
  addTrade: (trade: TradeRecord) => void
  updateTrade: (id: string, trade: Partial<TradeRecord>) => void
  deleteTrade: (id: string) => void
  setTrades: (trades: TradeRecord[]) => void

  // Rivens
  rivens: Riven[]
  addRiven: (riven: Riven) => void
  updateRiven: (id: string, riven: Partial<Riven>) => void
  deleteRiven: (id: string) => void
  setRivens: (rivens: Riven[]) => void

  // Builds
  builds: Build[]
  addBuild: (build: Build) => void
  updateBuild: (id: string, build: Partial<Build>) => void
  deleteBuild: (id: string) => void
  setBuild: (builds: Build[]) => void

  // Tasks
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  resetDailyTasks: () => void

  // Items
  items: Item[]
  setItems: (items: Item[]) => void
  addItem: (item: Item) => void
  updateItem: (id: string, item: Partial<Item>) => void
  deleteItem: (id: string) => void

  // Events
  events: Event[]
  setEvents: (events: Event[]) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, event: Partial<Event>) => void

  // Settings
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  updateNotificationSettings: (key: keyof Settings['notifications'], value: boolean) => void

  // UI State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  lastSync: number
  setLastSync: (time: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: user !== null }),
      setIsAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

      // Trades
      trades: [
        {
          id: '1',
          item: 'Nova Prime Blueprint',
          quantity: 1,
          price: 150,
          type: 'buy',
          trader: 'Player123',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          platform: 'pc',
          status: 'completed',
        },
        {
          id: '2',
          item: 'Soma Prime Set',
          quantity: 1,
          price: 200,
          type: 'sell',
          trader: 'Trader456',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          platform: 'pc',
          status: 'completed',
        },
      ],
      addTrade: (trade) => set((state) => ({ trades: [trade, ...state.trades] })),
      updateTrade: (id, trade) =>
        set((state) => ({
          trades: state.trades.map((t) => (t.id === id ? { ...t, ...trade } : t)),
        })),
      deleteTrade: (id) => set((state) => ({ trades: state.trades.filter((t) => t.id !== id) })),
      setTrades: (trades) => set({ trades }),

      // Rivens
      rivens: [
        {
          id: '1',
          weapon: 'Soma Prime',
          stats: ['+120% Damage', '+80% Critical Chance', '+60% Fire Rate'],
          rank: 8,
          price: 450,
          listed: true,
        },
        {
          id: '2',
          weapon: 'Braton',
          stats: ['+90% Damage', '+50% Multishot'],
          rank: 5,
          price: 80,
          listed: false,
        },
      ],
      addRiven: (riven) => set((state) => ({ rivens: [...state.rivens, riven] })),
      updateRiven: (id, riven) =>
        set((state) => ({
          rivens: state.rivens.map((r) => (r.id === id ? { ...r, ...riven } : r)),
        })),
      deleteRiven: (id) => set((state) => ({ rivens: state.rivens.filter((r) => r.id !== id) })),
      setRivens: (rivens) => set({ rivens }),

      // Builds
      builds: [
        {
          id: '1',
          name: 'Excalibur Exalted Blade',
          warframe: 'Excalibur',
          mods: ['Exalted Blade', 'Blind Rage', 'Transient Fortitude'],
          description: 'Build de dano puro para Exalted Blade',
          author: 'ProPlayer',
          rating: 4.8,
          downloads: 1250,
          difficulty: 'advanced',
        },
        {
          id: '2',
          name: 'Nova Speed Run',
          warframe: 'Nova',
          mods: ['Worm Hole', 'Molecular Prime', 'Fleeting Expertise'],
          description: 'Build otimizado para speed running',
          author: 'SpeedRunner',
          rating: 4.6,
          downloads: 890,
          difficulty: 'intermediate',
        },
      ],
      addBuild: (build) => set((state) => ({ builds: [...state.builds, build] })),
      updateBuild: (id, build) =>
        set((state) => ({
          builds: state.builds.map((b) => (b.id === id ? { ...b, ...build } : b)),
        })),
      deleteBuild: (id) => set((state) => ({ builds: state.builds.filter((b) => b.id !== id) })),
      setBuild: (builds) => set({ builds }),

      // Tasks
      tasks: [
        { id: '1', title: 'Sortie', category: 'daily', completed: false, expiry: '23:45', reward: 'Void Relic' },
        { id: '2', title: 'Nightwave Daily', category: 'daily', completed: false, expiry: '23:59', reward: '10 Credits' },
        { id: '3', title: 'Syndicate Standing', category: 'daily', completed: false, expiry: '23:59', reward: 'Items' },
        { id: '4', title: 'Void Fissure', category: 'daily', completed: false, expiry: '23:59', reward: 'Relics' },
        { id: '5', title: 'Invasion', category: 'daily', completed: false, expiry: '23:59', reward: 'Rewards' },
        { id: '6', title: 'Archon Hunt', category: 'weekly', completed: false, expiry: 'Saturday', reward: 'Archon Shards' },
        { id: '7', title: 'Steel Path Abyss', category: 'weekly', completed: false, expiry: 'Saturday', reward: 'Void Relic' },
      ],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, task) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
        })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      resetDailyTasks: () =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.category === 'daily' ? { ...t, completed: false } : t)),
        })),

      // Items
      items: [
        { id: '1', name: 'Excalibur', type: 'warframe', masteryXP: 3000, rarity: 'Common', status: 'mastered' },
        { id: '2', name: 'Nova', type: 'warframe', masteryXP: 3000, rarity: 'Rare', status: 'missing', price: 150 },
        { id: '3', name: 'Volt', type: 'warframe', masteryXP: 3000, rarity: 'Common', status: 'owned' },
        { id: '4', name: 'Braton', type: 'weapon', masteryXP: 3000, rarity: 'Common', status: 'mastered' },
        { id: '5', name: 'Soma Prime', type: 'weapon', masteryXP: 4500, rarity: 'Rare', status: 'missing', price: 200 },
        { id: '6', name: 'Carrier', type: 'companion', masteryXP: 3000, rarity: 'Common', status: 'owned' },
      ],
      setItems: (items) => set({ items }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, item) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...item } : i)),
        })),
      deleteItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      // Events
      events: [
        {
          id: '1',
          title: 'Alert: Defense - Moon',
          type: 'alert',
          location: 'Moon',
          reward: 'Void Relic',
          expiry: '23:45',
          active: true,
        },
        {
          id: '2',
          title: 'Void Fissure: Exterminate',
          type: 'fissure',
          location: 'Mars',
          reward: 'Relics',
          expiry: '2h 30m',
          active: true,
        },
        {
          id: '3',
          title: 'Invasion: Corpus vs Grineer',
          type: 'invasion',
          location: 'Venus',
          reward: 'Resources',
          expiry: '1h 15m',
          active: true,
        },
      ],
      setEvents: (events) => set({ events }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, event) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
        })),

      // Settings
      settings: {
        theme: 'auto',
        notifications: {
          tasks: true,
          events: true,
          baro: true,
          fissures: true,
          invasions: true,
          alerts: true,
          trades: true,
        },
        language: 'en',
        platform: 'pc',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateNotificationSettings: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: {
              ...state.settings.notifications,
              [key]: value,
            },
          },
        })),

      // UI State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),
      lastSync: 0,
      setLastSync: (time) => set({ lastSync: time }),
    }),
    {
      name: 'warframe-companion-store',
      version: 2,
    }
  )
)
