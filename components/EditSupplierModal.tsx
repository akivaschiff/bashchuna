'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { TRADES, Supplier } from '@/types'
import { useRouter } from 'next/navigation'

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
    trade: supplier.trade,
    phone: supplier.phone,
    description: supplier.description,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

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

      // Update supplier
      const { error: updateError } = await supabase
        .from('suppliers')
        .update({
          name: formData.name,
          trade: formData.trade,
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
      alert('שגיאה בעדכון ספק. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-card max-w-md w-full p-6 sm:p-8 shadow-modal max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-2">ערוך ספק</h2>
          <p className="text-neutral-600 text-sm">עדכן את הפרטים של הספק</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">שם הספק</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">מקצוע</label>
            <select
              value={formData.trade}
              onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
              className="input-field cursor-pointer"
            >
              {TRADES.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">טלפון</label>
            <input
              type="tel"
              required
              pattern="05[0-9]{8}"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              placeholder="05XXXXXXXX"
            />
            <p className="text-xs text-neutral-500 mt-1.5 mr-1">פורמט: 05 ואחריו 8 ספרות</p>
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
              {loading ? 'מעדכן...' : 'עדכן ספק'}
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
