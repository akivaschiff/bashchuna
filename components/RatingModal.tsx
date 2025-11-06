'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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

function StarInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number | null
  onChange: (value: number | null) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label} (optional)</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`px-3 py-1 text-sm rounded ${
            value === null ? 'bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          N/A
        </button>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl ${
              value !== null && star <= value ? 'text-yellow-400' : 'text-gray-300'
            } hover:scale-110 transition-transform`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
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
      alert('Failed to save rating. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {existingRating ? 'Update Your Rating' : 'Rate This Supplier'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <StarInput
            label="Quality"
            value={formData.quality}
            onChange={(value) => setFormData({ ...formData, quality: value })}
          />

          <StarInput
            label="Price/Value"
            value={formData.price}
            onChange={(value) => setFormData({ ...formData, price: value })}
          />

          <StarInput
            label="Reliability"
            value={formData.reliability}
            onChange={(value) => setFormData({ ...formData, reliability: value })}
          />

          <StarInput
            label="Communication"
            value={formData.communication}
            onChange={(value) => setFormData({ ...formData, communication: value })}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Comment (optional)
            </label>
            <textarea
              value={formData.comment || ''}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-3 py-2 border rounded-md h-24"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : existingRating ? 'Update Rating' : 'Submit Rating'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
