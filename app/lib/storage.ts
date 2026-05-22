// Временное хранилище данных (потом заменим на Google Sheets)

export interface User {
  id: string
  name: string
  username: string
  phone: string
  role: 'owner' | 'admin' | 'moderator' | 'user'
  banned: boolean
  rating: number
  historyViews: string[] // ID объявлений которые просмотрел
  createdAt: string
}

export interface Ad {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  sellerId: string
  sellerName: string
  createdAt: string
  views: number
  rating: number
  complaints: number
}

export interface Complaint {
  id: string
  adId: string
  fromUserId: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export interface Report {
  id: string
  userId: string
  reason: string
  createdAt: string
}

export interface Banner {
  id: string
  title: string
  link: string
  active: boolean
}

// Начальные данные
export let users: User[] = [
  {
    id: '998579758',
    name: '𓆩nukm0𓆪',
    username: 'nukm0',
    phone: '+79637427766',
    role: 'owner',
    banned: false,
    rating: 5,
    historyViews: [],
    createdAt: new Date().toISOString(),
  }
]

export let ads: Ad[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro',
    description: 'Отличное состояние, комплект полный, гарантия',
    price: 70000,
    imageUrl: 'https://images.unsplash.com/photo-1678652196566-7b92f8e4cee1?w=400',
    sellerId: '998579758',
    sellerName: '𓆩nukm0𓆪',
    createdAt: new Date().toISOString(),
    views: 15,
    rating: 4,
    complaints: 0,
  },
  {
    id: '2',
    title: 'Nike Air Max 90',
    description: 'Кроссовки, размер 42, новые в коробке',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    sellerId: '998579758',
    sellerName: '𓆩nukm0𓆪',
    createdAt: new Date().toISOString(),
    views: 8,
    rating: 5,
    complaints: 0,
  },
  {
    id: '3',
    title: 'PlayStation 5',
    description: 'Цифровая версия, 2 геймпада, игры в подарок',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
    sellerId: '998579758',
    sellerName: '𓆩nukm0𓆪',
    createdAt: new Date().toISOString(),
    views: 23,
    rating: 5,
    complaints: 0,
  },
]

export let complaints: Complaint[] = []
export let reports: Report[] = []
export let banners: Banner[] = [
  { id: '1', title: '🔥 Сезонная распродажа! Скидки до 50%', link: 'https://example.com/sale', active: true },
  { id: '2', title: '📱 Новые поступления электроники', link: 'https://example.com/electronics', active: true },
]

// Функции для работы с данными
export function addAd(ad: Ad) { ads.push(ad) }
export function addComplaint(complaint: Complaint) { complaints.push(complaint) }
export function addReport(report: Report) { reports.push(report) }
export function addBanner(banner: Banner) { banners.push(banner) }
export function updateAd(id: string, updates: Partial<Ad>) {
  const index = ads.findIndex(a => a.id === id)
  if (index !== -1) ads[index] = { ...ads[index], ...updates }
}
export function updateUser(id: string, updates: Partial<User>) {
  const index = users.findIndex(u => u.id === id)
  if (index !== -1) users[index] = { ...users[index], ...updates }
}
