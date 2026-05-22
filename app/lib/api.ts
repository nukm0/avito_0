export async function getAds() {
  const res = await fetch('/api/ads')
  return res.json()
}

export async function getAdById(id: string) {
  const res = await fetch(`/api/ads/${id}`)
  return res.json()
}

export async function createAd(data: any) {
  const res = await fetch('/api/ads', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
  return res.json()
}

export async function purchaseAd(adId: string, userId: string) {
  // Перенаправляем на профиль продавца
  const res = await fetch(`/api/ads/${adId}/purchase`, {
    method: 'POST',
    body: JSON.stringify({ userId })
  })
  const { sellerId } = await res.json()
  window.location.href = `/profile/${sellerId}`
}
