import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { ShoppingBagIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Footer } from '@/components/layout/Footer'

export function EmptyCartState() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24 pb-12 px-4">
        <div className="mx-auto max-w-4xl">
          <Card className="border-slate-100 shadow-lg rounded-2xl">
            <CardContent className="py-16">
              <Empty>
                <EmptyMedia variant="icon">
                  <ShoppingBagIcon className="text-ocean-500" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle className="text-navy-900">Your cart is empty</EmptyTitle>
                  <EmptyDescription>
                    Add a few items from the catalog to see them here.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Link
                    to="/store"
                    className="inline-flex items-center gap-2 rounded-full bg-ocean-500 hover:bg-ocean-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Browse Store
                  </Link>
                </EmptyContent>
              </Empty>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}