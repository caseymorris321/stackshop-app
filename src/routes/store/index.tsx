import { useState } from 'react'
import { createMiddleware, createServerFn, json } from '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ProductCard } from '@/components/ProductCard'
import { categories, type CategoryValue } from '@/db/schema'
import { cn } from '@/lib/utils'
import { Bike, Dumbbell, Mountain, Sparkles, Timer, Footprints } from 'lucide-react'

const categoryIcons: Record<CategoryValue, React.ReactNode> = {
  running: <Footprints size={16} />,
  cycling: <Bike size={16} />,
  gym: <Dumbbell size={16} />,
  outdoor: <Mountain size={16} />,
  recovery: <Timer size={16} />,
  everyday: <Sparkles size={16} />,
}

const categoryLabels: Record<CategoryValue, string> = {
  running: 'Running',
  cycling: 'Cycling',
  gym: 'Gym',
  outdoor: 'Outdoor',
  recovery: 'Recovery',
  everyday: 'Everyday',
}

const fetchProducts = createServerFn({ method: 'GET' }).handler(async () => {
  const { getAllProducts } = await import('@/data/products')
  const data = await getAllProducts()

  return data
})

const loggerMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    console.log(
      '---loggerMiddleware---',
      request.url,
      'from',
      request.headers.get('origin'),
    )
    return next()
  },
)

export const Route = createFileRoute('/store/')({
  component: RouteComponent,
  loader: async () => {
    // This runs on server during SSR AND on client during navigation
    return fetchProducts()
  },
  server: {
    middleware: [loggerMiddleware],
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        return json({ message: 'Hello, world from POST request!', body })
      },
    },
  },
})

function RouteComponent() {
  const products = Route.useLoaderData()
  const [selectedCategory, setSelectedCategory] = useState<CategoryValue | 'all'>('all')

  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: async () => fetchProducts(),
    initialData: products,
  })

  const filteredProducts = selectedCategory === 'all'
    ? data
    : data.filter((product) => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-navy-950 dark:to-navy-900 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Page Header */}
        <section className="mb-8">
          <Card className="p-8 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm border-slate-100 dark:border-sky-400/10 shadow-lg">
            <div className="space-y-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-ocean-500 dark:text-ocean-400">
                WatersLab Collection
              </span>
              <CardTitle className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-sky-100">
                Hydration Products
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-sky-200 max-w-2xl">
                Premium electrolytes, bottles, and accessories designed for
                athletes who demand peak performance.
              </CardDescription>
            </div>
          </Card>
        </section>

        {/* Activity Filters */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                selectedCategory === 'all'
                  ? 'bg-ocean-500 text-white shadow-md shadow-ocean-500/25'
                  : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-sky-200 border border-slate-200 dark:border-sky-400/20 hover:border-ocean-300 hover:text-ocean-600 dark:hover:text-ocean-400'
              )}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedCategory === category
                    ? 'bg-ocean-500 text-white shadow-md shadow-ocean-500/25'
                    : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-sky-200 border border-slate-200 dark:border-sky-400/20 hover:border-ocean-300 hover:text-ocean-600 dark:hover:text-ocean-400'
                )}
              >
                {categoryIcons[category]}
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 dark:text-sky-300 text-lg">No products found in this category.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 text-ocean-500 dark:text-ocean-400 font-medium hover:text-ocean-600"
              >
                View all products
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <ProductCard key={`product-${index}`} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
