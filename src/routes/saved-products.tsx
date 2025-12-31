import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { WaterDropLoader } from '@/components/ui/water-drop-loader'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { mutateCartFn } from '@/routes/cart'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import type { ProductSelect } from '@/db/schema'

const getSavedProductsServerFn = createServerFn({ method: 'GET' })
  .inputValidator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const { getSavedProducts } = await import('@/data/saved-products')
    return getSavedProducts(userId)
  })

const removeSavedProductServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { userId: string; productId: string }) => data)
  .handler(async ({ data }) => {
    const { removeSavedProduct } = await import('@/data/saved-products')
    await removeSavedProduct(data.userId, data.productId)
    return { success: true }
  })

export const Route = createFileRoute('/saved-products')({
  component: SavedProductsPage,
})

function SavedProductsPage() {
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { isSignedIn, user, isLoaded } = useUser()
  const [savedProducts, setSavedProducts] = useState<
    Array<{ id: string; product: ProductSelect }>
  >([])
  const [isLoading, setIsLoading] = useState(true)

  const userId = user?.id ?? null

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      navigate({ to: '/login' })
    } else if (userId) {
      getSavedProductsServerFn({ data: userId }).then((products) => {
        setSavedProducts(products)
        setIsLoading(false)
      })
    }
  }, [isLoaded, isSignedIn, userId, navigate])

  const handleRemove = async (productId: string) => {
    if (!userId) return
    await removeSavedProductServerFn({ data: { userId, productId } })
    setSavedProducts((prev) => prev.filter((p) => p.product.id !== productId))
    // Update the saved count in nav
    await queryClient.invalidateQueries({
      queryKey: ['saved-products-count', userId],
    })
  }

  const handleAddToCart = async (productId: string) => {
    await mutateCartFn({
      data: {
        action: 'add',
        productId,
        quantity: 1,
        userId,
      },
    })
    await router.invalidate({ sync: true })
    await queryClient.invalidateQueries({
      queryKey: ['cart-items-data', userId],
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <WaterDropLoader size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          to="/store"
          className="inline-flex items-center gap-2 text-sm font-medium text-ocean-600 hover:text-ocean-700 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Store
        </Link>

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-red-50">
            <Heart size={24} className="text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Saved Products</h1>
            <p className="text-slate-600">
              {savedProducts.length} item{savedProducts.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
        </div>

        {savedProducts.length === 0 ? (
          <Card className="bg-white border-slate-100 shadow-sm">
            <CardContent className="py-16 text-center">
              <Heart size={48} className="mx-auto text-slate-300 mb-4" />
              <h2 className="text-xl font-semibold text-navy-900 mb-2">
                No saved products yet
              </h2>
              <p className="text-slate-600 mb-6">
                Save products you love to find them easily later
              </p>
              <Link
                to="/store"
                className={cn(
                  'inline-flex items-center gap-2',
                  'px-6 py-3 rounded-full',
                  'bg-ocean-500 hover:bg-ocean-600',
                  'text-white font-semibold',
                  'transition-colors',
                )}
              >
                Browse Store
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedProducts.map(({ product }) => (
              <Link
                key={product.id}
                to="/store/$id"
                params={{ id: product.id }}
                className="block h-full cursor-default"
              >
                <Card className="h-full flex flex-col bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  <CardHeader className="gap-2 pb-2">
                    <div className="flex items-center justify-between h-6">
                      <div className="flex items-center gap-2">
                        {product.badge ? (
                          <span className="rounded-full bg-ocean-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                            {product.badge}
                          </span>
                        ) : (
                          <span className="rounded-full bg-transparent px-2.5 py-0.5 text-xs font-semibold invisible">
                            Placeholder
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemove(product.id)
                        }}
                        className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <CardTitle className="text-lg font-semibold text-navy-900">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-slate-600 line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex items-center justify-between pt-2">
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-semibold text-navy-800">{product.rating}/5</span>
                      <span className="text-slate-400">({product.reviews} reviews)</span>
                    </p>
                    <span
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-semibold',
                        product.inventory === 'in-stock'
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : product.inventory === 'backorder'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-sky-50 text-sky-700 border-sky-100',
                      )}
                    >
                      {product.inventory === 'in-stock'
                        ? 'In Stock'
                        : product.inventory === 'backorder'
                          ? 'Backorder'
                          : 'Preorder'}
                    </span>
                  </CardContent>
                  <CardFooter className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                    <span className="text-xl font-bold text-navy-900">${product.price}</span>
                    <Button
                      size="sm"
                      className="bg-ocean-500 hover:bg-ocean-600 text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleAddToCart(product.id)
                      }}
                    >
                      <ShoppingBag size={16} /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
