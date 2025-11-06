type RatingDisplayProps = {
  quality: number | null
  price: number | null
  reliability: number | null
  communication: number | null
  ratingCount?: number
  compact?: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function RatingItem({
  label,
  value,
  count,
  compact,
}: {
  label: string
  value: number | null
  count?: number
  compact?: boolean
}) {
  if (value === null) {
    return compact ? null : (
      <div className="text-sm text-gray-500">{label}: טרם דורג</div>
    )
  }

  return (
    <div className={compact ? 'text-sm' : ''}>
      <div className="flex items-center gap-2">
        <span className="text-gray-700 font-medium">{label}:</span>
        <StarRating rating={Math.round(value)} />
        <span className="text-gray-600">
          {value.toFixed(1)}
          {count !== undefined && ` (${count})`}
        </span>
      </div>
    </div>
  )
}

export function RatingDisplay({
  quality,
  price,
  reliability,
  communication,
  ratingCount = 0,
  compact = false,
}: RatingDisplayProps) {
  const hasAnyRating = quality !== null || price !== null || reliability !== null || communication !== null

  if (!hasAnyRating) {
    return (
      <div className="text-sm text-gray-500">
        אין דירוגים עדיין
      </div>
    )
  }

  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      <RatingItem label="איכות" value={quality} count={ratingCount} compact={compact} />
      <RatingItem label="מחיר" value={price} count={ratingCount} compact={compact} />
      <RatingItem label="אמינות" value={reliability} count={ratingCount} compact={compact} />
      <RatingItem label="תקשורת" value={communication} count={ratingCount} compact={compact} />
    </div>
  )
}
