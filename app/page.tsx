'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import AdCard from '@/components/AdCard'
import Banner from '@/components/Banner'
import { getAds, getBanners } from '@/lib/api'

export default function Home() {
  const [ads, setAds] = useState([])
  const [filteredAds, setFilteredAds] = useState([])
  const [banners, setBanners] = useState([])

  useEffect(() => {
    getAds().then(setAds)
    getBanners().then(setBanners)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Баннеры */}
      {banners.map((banner: any, idx: number) => (
        <Banner key={idx} title={banner[0]} link={banner[1]} />
      ))}

      {/* Поиск */}
      <div className="mb-8">
        <SearchBar items={ads} onSearch={setFilteredAds} />
      </div>

      {/* Список объявлений */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(filteredAds.length > 0 ? filteredAds : ads).map((ad: any) => (
          <AdCard key={ad[0]} ad={ad} />
        ))}
      </div>
    </div>
  )
}
