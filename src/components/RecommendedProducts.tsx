import { use } from 'react'
import { ProductCard } from './ProductCard'
import type { ProductSelect } from '@/db/schema'

export function RecommendedProducts({
  recommendedProducts,
}: {
  recommendedProducts: Promise<Array<ProductSelect>>
}) {
  const recommendedProductsData = use(recommendedProducts)
  return (
    <div className="mb-6">
      <h2 className="2xl font-bold my-4">Recommended Products</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendedProductsData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
