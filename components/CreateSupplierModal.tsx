'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { TRADES } from '@/types'
import { useRouter } from 'next/navigation'

type CreateSupplierModalProps = {
  userId: string
  onClose: () => void
}

export function CreateSupplierModal({ userId, onClose }: CreateSupplierModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    trade: 'שרברב',
    phone: '',
    description: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

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

      // Create supplier
      const { error: insertError } = await supabase
        .from('suppliers')
        .insert({
          name: formData.name,
          trade: formData.trade,
          phone: formData.phone,
          description: formData.description,
          image_url: imageUrl,
          created_by: userId,
        })

      if (insertError) throw insertError

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error creating supplier:', error)
      alert('שגיאה ביצירת ספק. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-card max-w-md w-full p-6 sm:p-8 shadow-modal max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-2">הוסף ספק חדש</h2>
          <p className="text-neutral-600 text-sm">הוסף את הפרטים של הספק המומלץ שלך</p>
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
              placeholder="לדוגמה: דוד כהן"
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
              placeholder="ספר לנו על הניסיון שלך עם הספק..."
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

          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'יוצר...' : 'צור ספק'}
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
