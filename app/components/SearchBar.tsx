'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

export default function SearchBar({ items, onSearch }: any) {
  const [query, setQuery] = useState('')
  const [priceFrom, setPriceFrom] = useState('')
  const [priceTo, setPriceTo] = useState('')

  const handleSearch = () => {
    const filtered = items.filter((item: any) => {
      const title = item[1].toLowerCase()
      const desc = item[2].toLowerCase()
      const price = parseInt(item[3])
      const matchesText = title.includes(query.toLowerCase()) || desc.includes(query.toLowerCase())
      const matchesPrice = (!priceFrom || price >= parseInt(priceFrom)) && 
                          (!priceTo || price <= parseInt(priceTo))
      return matchesText && matchesPrice
    })
    onSearch(filtered)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-32">
          <input
            type="number"
            placeholder="Цена от"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="w-32">
          <input
            type="number"
            placeholder="Цена до"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Search size={20} /> Найти
        </button>
      </div>
    </div>
  )
}
