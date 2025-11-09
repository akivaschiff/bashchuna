'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { StarInput } from './StarInput'

type RatingModalProps = {
  supplierId: string
  userId: string
  existingRating?: {
    quality: number | null
    price: number | null
    reliability: number | null
    communication: number | null
    comment: string | null
  }
  onClose: () => void
}

export function RatingModal({
  supplierId,
  userId,
  existingRating,
  onClose,
}: RatingModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    quality: existingRating?.quality ?? null,
    price: existingRating?.price ?? null,
    reliability: existingRating?.reliability ?? null,
    communication: existingRating?.communication ?? null,
    comment: existingRating?.comment ?? '',
  })

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
    if (!confirm('האם למחוק את הדירוג? פעולה זו לא ניתנת לביטול.')) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('supplier_id', supplierId)
        .eq('user_id', userId)

      if (error) throw error

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error deleting rating:', error)
      alert('שגיאה במחיקת הדירוג. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('ratings')
        .upsert({
          supplier_id: supplierId,
          user_id: userId,
          quality: formData.quality,
          price: formData.price,
          reliability: formData.reliability,
          communication: formData.communication,
          comment: formData.comment || null,
        }, {
          onConflict: 'supplier_id,user_id'
        })

      if (error) throw error

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error saving rating:', error)
      alert('שגיאה בשמירת הדירוג. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-card max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-modal">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-2">
            {existingRating ? 'עדכון הדירוג' : 'דירוג'}
          </h2>
          <p className="text-neutral-600 text-sm">דירוג לפי קריטריונים</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <StarInput
            label="איכות"
            value={formData.quality}
            onChange={(value) => setFormData({ ...formData, quality: value })}
          />

          <StarInput
            label="מחיר"
            value={formData.price}
            onChange={(value) => setFormData({ ...formData, price: value })}
          />

          <StarInput
            label="אמינות"
            value={formData.reliability}
            onChange={(value) => setFormData({ ...formData, reliability: value })}
          />

          <StarInput
            label="תקשורת"
            value={formData.communication}
            onChange={(value) => setFormData({ ...formData, communication: value })}
          />

          <div className="pt-2">
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              הערה <span className="text-neutral-400 font-normal">(אופציונלי)</span>
            </label>
            <textarea
              value={formData.comment || ''}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="input-field h-28 resize-none"
              placeholder="שתפו אותנו בחוויה..."
            />
          </div>

          <div className="flex gap-3 pt-6 border-t border-neutral-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'שומר...' : existingRating ? 'עדכון דירוג' : 'שליחת דירוג'}
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

        {/* Delete button - only show if editing existing rating */}
        {existingRating && (
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="w-full px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-input hover:bg-red-100 hover:border-red-300 active:bg-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'מוחק...' : 'מחיקת דירוג'}
            </button>
            <p className="text-xs text-neutral-500 text-center mt-2">פעולה זו תמחק את הדירוג לצמיתות</p>
          </div>
        )}
      </div>
    </div>
  )
}
