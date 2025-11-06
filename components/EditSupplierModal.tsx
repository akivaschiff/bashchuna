'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { TRADES, Supplier } from '@/types'
import { useRouter } from 'next/navigation'

type EditSupplierModalProps = {
  supplier: Supplier
  onClose: () => void
}

export function EditSupplierModal({ supplier, onClose }: EditSupplierModalProps) {
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

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error updating supplier:', error)
      alert('שגיאה בעדכון ספק. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">ערוך ספק</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">שם</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">מקצוע</label>
            <select
              value={formData.trade}
              onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              {TRADES.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">טלפון</label>
            <input
              type="tel"
              required
              pattern="05[0-9]{8}"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="05XXXXXXXX"
            />
            <p className="text-xs text-gray-500 mt-1">פורמט: 05 ואחריו 8 ספרות</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">תיאור</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">תמונה חדשה (אופציונלי)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full"
            />
            {supplier.image_url && !imageFile && (
              <p className="text-xs text-gray-500 mt-1">התמונה הנוכחית תישאר אם לא תבחר תמונה חדשה</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'מעדכן...' : 'עדכן ספק'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
