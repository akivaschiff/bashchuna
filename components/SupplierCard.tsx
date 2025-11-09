import { RatingDisplay } from './RatingDisplay'
import { SupplierWithCreator } from '@/types'

type SupplierCardProps = {
  supplier: SupplierWithCreator
  onClick: () => void
}

export function SupplierCard({ supplier, onClick }: SupplierCardProps) {
  return (
    <div
      onClick={onClick}
      className="card p-5 cursor-pointer active:scale-[0.99] group border border-neutral-200 hover:border-primary-200"
    >
      {supplier.image_url ? (
        <div className="relative overflow-hidden rounded-card mb-4">
          <img
            src={supplier.image_url}
            alt={supplier.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-card mb-4 flex items-center justify-center border border-neutral-200">
          <span className="text-neutral-400 text-5xl">📋</span>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 mb-1.5 tracking-tight group-hover:text-primary-600 transition-colors duration-200">
            {supplier.name}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {supplier.trades.map((trade) => (
              <span
                key={trade}
                className="text-neutral-600 text-xs font-medium bg-neutral-50 px-2.5 py-1 rounded-full border border-neutral-200"
              >
                {trade}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-1">
          <RatingDisplay
            quality={supplier.avg_quality}
            price={supplier.avg_price}
            reliability={supplier.avg_reliability}
            communication={supplier.avg_communication}
            qualityCount={supplier.quality_count}
            priceCount={supplier.price_count}
            reliabilityCount={supplier.reliability_count}
            communicationCount={supplier.communication_count}
            compact
          />
        </div>

        <div className="pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 font-medium">
            נוסף על ידי {supplier.creator.name}
          </p>
        </div>
      </div>
    </div>
  )
}
