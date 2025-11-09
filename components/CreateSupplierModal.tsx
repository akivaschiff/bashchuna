'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { TRADES } from '@/types'
import { useRouter } from 'next/navigation'
import { PhoneInput } from './PhoneInput'
import { StarInput } from './StarInput'

type CreateSupplierModalProps = {
  userId: string
  onClose: () => void
}

export function CreateSupplierModal({ userId, onClose }: CreateSupplierModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    trades: [] as string[],
    phone: '',
    description: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [rating, setRating] = useState({
    quality: null as number | null,
    price: null as number | null,
    reliability: null as number | null,
    communication: null as number | null,
    comment: '',
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      let imageUrl: string | null = null

      // Upload image if provided
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

      // Create supplier
      const { data: supplierData, error: insertError } = await supabase
        .from('suppliers')
        .insert({
          name: formData.name,
          trades: formData.trades,
          phone: formData.phone,
          description: formData.description,
          image_url: imageUrl,
          created_by: userId,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Create rating if any rating data is provided
      const hasRating = rating.quality !== null || rating.price !== null ||
                        rating.reliability !== null || rating.communication !== null ||
                        rating.comment.trim() !== ''

      if (hasRating && supplierData) {
        const { error: ratingError } = await supabase
          .from('ratings')
          .insert({
            supplier_id: supplierData.id,
            user_id: userId,
            quality: rating.quality,
            price: rating.price,
            reliability: rating.reliability,
            communication: rating.communication,
            comment: rating.comment || null,
          })

        if (ratingError) throw ratingError
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error creating supplier:', error)
      alert('שגיאה ביצירת המלצה. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-card max-w-md w-full p-6 sm:p-8 shadow-modal max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-2">יצירת המלצה חדשה</h2>
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
              placeholder="לדוגמה: דוד כהן"
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
              placeholder="שתפו אותנו בחוויה..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              תמונה <span className="text-neutral-400 font-normal">(אופציונלי)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-input file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 file:cursor-pointer cursor-pointer"
            />
          </div>

          {/* Optional Rating Section */}
          <div className="pt-6 border-t border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              דירוג <span className="text-neutral-500 font-normal text-sm">(אופציונלי)</span>
            </h3>
            <p className="text-sm text-neutral-600 mb-4">
              ניתן להוסיף דירוג ראשוני עם ההמלצה
            </p>

            <div className="space-y-4">
              <StarInput
                label="איכות"
                value={rating.quality}
                onChange={(value) => setRating({ ...rating, quality: value })}
              />

              <StarInput
                label="מחיר"
                value={rating.price}
                onChange={(value) => setRating({ ...rating, price: value })}
              />

              <StarInput
                label="אמינות"
                value={rating.reliability}
                onChange={(value) => setRating({ ...rating, reliability: value })}
              />

              <StarInput
                label="תקשורת"
                value={rating.communication}
                onChange={(value) => setRating({ ...rating, communication: value })}
              />

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  הערה <span className="text-neutral-400 font-normal">(אופציונלי)</span>
                </label>
                <textarea
                  value={rating.comment}
                  onChange={(e) => setRating({ ...rating, comment: e.target.value })}
                  className="input-field h-28 resize-none"
                  placeholder="שתפו אותנו בחוויה..."
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'שומר...' : 'יצירת המלצה'}
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
      </div>
    </div>
  )
}
