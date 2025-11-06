'use client'

import { useState } from 'react'
import { SupplierCard } from './SupplierCard'
import { CreateSupplierModal } from './CreateSupplierModal'
import { SupplierWithCreator, TRADES } from '@/types'

type SupplierListProps = {
  suppliers: SupplierWithCreator[]
  userId: string | null
}

export function SupplierList({ suppliers, userId }: SupplierListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrade, setSelectedTrade] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTrade = selectedTrade === 'all' || supplier.trade === selectedTrade
    return matchesSearch && matchesTrade
  })

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="חפש ספקים..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md"
        />

        <select
          value={selectedTrade}
          onChange={(e) => setSelectedTrade(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">כל המקצועות</option>
          {TRADES.map((trade) => (
            <option key={trade} value={trade}>
              {trade}
            </option>
          ))}
        </select>

        {userId && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            הוסף ספק
          </button>
        )}
      </div>

      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          לא נמצאו ספקים. {userId && 'היה הראשון להוסיף!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}

      {showCreateModal && userId && (
        <CreateSupplierModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}
