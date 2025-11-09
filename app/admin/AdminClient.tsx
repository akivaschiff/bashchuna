'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { SupplierWithCreator } from '@/types'
import { formatDate } from '@/lib/utils'

export function AdminClient({ suppliers }: { suppliers: SupplierWithCreator[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleDelete = async (supplierId: string) => {
    if (confirmDeleteId !== supplierId) {
      setConfirmDeleteId(supplierId)
      return
    }

    setDeletingId(supplierId)

    try {
      const supabase = createClient()

      // First delete all ratings for this supplier
      await supabase
        .from('ratings')
        .delete()
        .eq('supplier_id', supplierId)

      // Then delete the supplier
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierId)

      if (error) throw error

      router.refresh()
      setConfirmDeleteId(null)
    } catch (error) {
      console.error('Error deleting supplier:', error)
      alert('שגיאה במחיקת ספק. נסה שוב.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {suppliers.map((supplier) => (
        <div
          key={supplier.id}
          className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg"
        >
          {supplier.image_url ? (
            <img
              src={supplier.image_url}
              alt={supplier.name}
              className="w-full sm:w-32 h-32 object-cover rounded"
            />
          ) : (
            <div className="w-full sm:w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 text-3xl">📋</span>
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-lg font-semibold">{supplier.name}</h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {supplier.trades.map((trade) => (
                <span
                  key={trade}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                >
                  {trade}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              נוסף על ידי {supplier.creator.name}
            </p>
            <p className="text-gray-500 text-sm">
              {formatDate(supplier.created_at)}
            </p>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => handleDelete(supplier.id)}
              disabled={deletingId === supplier.id}
              className={`px-4 py-2 rounded-md transition-colors ${
                confirmDeleteId === supplier.id
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
              } disabled:opacity-50`}
            >
              {deletingId === supplier.id
                ? 'מוחק...'
                : confirmDeleteId === supplier.id
                ? 'לחץ שוב לאישור'
                : 'מחק'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
