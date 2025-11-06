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
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-4 cursor-pointer active:scale-[0.98]"
    >
      {supplier.image_url ? (
        <img
          src={supplier.image_url}
          alt={supplier.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-400 text-4xl">📋</span>
        </div>
      )}

      <h3 className="text-xl font-bold mb-1">{supplier.name}</h3>
      <p className="text-gray-600 text-sm mb-3 font-medium">{supplier.trade}</p>

      <div className="mb-3">
        <RatingDisplay
          quality={supplier.avg_quality}
          price={supplier.avg_price}
          reliability={supplier.avg_reliability}
          communication={supplier.avg_communication}
          ratingCount={supplier.rating_count}
          compact
        />
      </div>

      <p className="text-xs text-gray-500">
        נוסף על ידי {supplier.creator.name}
      </p>
    </div>
  )
}
