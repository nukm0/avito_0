'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string, minPrice: number, maxPrice: number) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onSearch(query, parseInt(minPrice) || 0, parseInt(maxPrice) || 999999999)
  }

  const handleClear = () => {
    setQuery('')
    setMinPrice('')
    setMaxPrice('')
    onSearch('', 0, 999999999)
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl border transition flex items-center gap-2 ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:border-blue-400'}`}
        >
          <Filter size={18} /> Фильтры
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition"
        >
          Найти
        </button>
      </div>
      
      {showFilters && (
        <div className="mt-4 pt-4 border-t flex gap-4 flex-wrap">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Цена от</label>
            <input
              type="number"
              placeholder="0 ₽"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Цена до</label>
            <input
              type="number"
              placeholder="999 999 ₽"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button onClick={handleClear} className="flex items-center gap-1 text-gray-500 hover:text-red-500 mt-5">
            <X size={16} /> Сбросить
          </button>
        </div>
      )}
    </div>
  )
}
