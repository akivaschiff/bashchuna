'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { TRADES, Supplier } from '@/types'
import { useRouter } from 'next/navigation'
import { PhoneInput } from './PhoneInput'

type EditSupplierModalProps = {
  supplier: Supplier
  onClose: () => void
  onSuccess?: () => void
}

export function EditSupplierModal({ supplier, onClose, onSuccess }: EditSupplierModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: supplier.name,
    trades: supplier.trades || [],
    phone: supplier.phone,
    description: supplier.description,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleTradeToggle = (trade: string) => {
    setFormData(prev => ({
      ...prev,
      trades: prev.trades.includes(trade)
        ? prev.trades.filter(t => t !== trade)
        : [...prev.trades, trade]
    }))
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [loading, onClose])

  const handleDelete = async () => {
    if (!confirm('האם למחוק את ההמלצה? פעולה זו לא ניתנת לביטול.')) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplier.id)

      if (error) throw error

      router.refresh()
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error deleting supplier:', error)
      alert('שגיאה במחיקת ההמלצה. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      let imageUrl = supplier.image_url

      // Upload new image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('supplier-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('supplier-images')
          .getPublicUrl(uploadData.path)

        imageUrl = publicUrl
      }

      // Validate at least one trade is selected
      if (formData.trades.length === 0) {
        alert('אנא בחר לפחות מקצוע אחד')
        setLoading(false)
        return
      }

      // Update supplier
      const { error: updateError } = await supabase
        .from('suppliers')
        .update({
          name: formData.name,
          trades: formData.trades,
          phone: formData.phone,
          description: formData.description,
          image_url: imageUrl,
        })
        .eq('id', supplier.id)

      if (updateError) throw updateError

      // Refresh the router to get updated data
      router.refresh()

      // Call success callback if provided (to re-fetch data in modals)
      onSuccess?.()

      // Small delay to ensure refresh completes before closing
      await new Promise(resolve => setTimeout(resolve, 300))
      onClose()
    } catch (error) {
      console.error('Error updating supplier:', error)
      alert('שגיאה בעדכון המלצה. נסה שוב.')
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-card max-w-md w-full p-6 sm:p-8 shadow-modal max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-2">עריכת המלצה</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">שם</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">מקצועות</label>
            <div className="bg-neutral-50 border border-neutral-300 rounded-input p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {TRADES.map((trade) => (
                  <label
                    key={trade}
                    className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.trades.includes(trade)}
                      onChange={() => handleTradeToggle(trade)}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm text-neutral-700">{trade}</span>
                  </label>
                ))}
              </div>
            </div>
            {formData.trades.length > 0 && (
              <p className="text-xs text-neutral-600 mt-2">
                נבחרו: {formData.trades.join(', ')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">טלפון</label>
            <PhoneInput
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">תיאור</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field h-28 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              תמונה חדשה <span className="text-neutral-400 font-normal">(אופציונלי)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-input file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 file:cursor-pointer cursor-pointer"
            />
            {supplier.image_url && !imageFile && (
              <p className="text-xs text-neutral-500 mt-1.5 mr-1">התמונה הנוכחית תישאר אם לא תבחר תמונה חדשה</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'שומר...' : 'עדכון המלצה'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              ביטול
            </button>
          </div>
        </form>

        {/* Delete button - separated from form */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-input hover:bg-red-100 hover:border-red-300 active:bg-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'מוחק...' : 'מחיקת המלצה'}
          </button>
          <p className="text-xs text-neutral-500 text-center mt-2">פעולה זו תמחק את ההמלצה לצמיתות</p>
        </div>
      </div>
    </div>
  )
}
