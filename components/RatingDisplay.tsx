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
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'star-rating text-lg' : 'star-empty text-lg'}
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
      <div className="text-sm text-neutral-500 font-medium">{label}: טרם דורג</div>
    )
  }

  return (
    <div className={compact ? 'text-sm' : ''}>
      <div className="flex items-center gap-2">
        <span className="text-neutral-700 font-semibold text-sm min-w-[60px]">{label}:</span>
        <StarRating rating={Math.round(value)} />
        <span className="text-neutral-600 font-medium text-sm tabular-nums">
          {value.toFixed(1)}
          {count !== undefined && count > 0 && (
            <span className="text-neutral-400 mr-1">({count})</span>
          )}
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
      <div className="text-sm text-neutral-500 font-medium bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200 inline-block">
        אין דירוגים עדיין
      </div>
    )
  }

  return (
    <div className={compact ? 'space-y-1.5' : 'space-y-2.5'}>
      <RatingItem label="איכות" value={quality} count={compact ? undefined : ratingCount} compact={compact} />
      <RatingItem label="מחיר" value={price} count={compact ? undefined : ratingCount} compact={compact} />
      <RatingItem label="אמינות" value={reliability} count={compact ? undefined : ratingCount} compact={compact} />
      <RatingItem label="תקשורת" value={communication} count={compact ? undefined : ratingCount} compact={compact} />
    </div>
  )
}
