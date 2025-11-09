'use client'

type StarInputProps = {
  label: string
  value: number | null
  onChange: (value: number | null) => void
}

export function StarInput({ label, value, onChange }: StarInputProps) {
  return (
    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
      <label className="block text-sm font-semibold text-neutral-700 mb-3">
        {label} <span className="text-neutral-400 font-normal">(אופציונלי)</span>
      </label>
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`px-3 py-1.5 text-sm rounded-input font-medium transition-all duration-200 ${
            value === null
              ? 'bg-neutral-900 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-300'
          }`}
        >
          ללא
        </button>
        <div className="flex-1 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`text-3xl transition-all duration-200 hover:scale-110 ${
                value !== null && star <= value ? 'star-rating' : 'star-empty hover:text-neutral-400'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
