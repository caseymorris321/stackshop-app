import { useUser, SignInButton } from '@clerk/clerk-react'
import { cn } from '@/lib/utils'
import { SummaryRow } from './SummaryRow'

export function CartFooter({
  subtotal,
  shipping,
  total,
}: {
  subtotal: number
  shipping: number
  total: number
}) {
  const { isSignedIn, isLoaded } = useUser()

  const buttonClasses = cn(
    'w-full flex items-center justify-center gap-2',
    'px-6 py-4 rounded-xl',
    'bg-ocean-500 hover:bg-ocean-600',
    'text-white font-semibold',
    'shadow-lg shadow-ocean-500/25',
    'hover:-translate-y-0.5 hover:shadow-xl',
    'transition-all duration-200',
    'cursor-pointer',
  )

  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 dark:border-sky-400/10 bg-white dark:bg-navy-800 p-6 text-sm shadow-lg h-fit sticky top-28">
      <h2 className="text-lg font-bold text-navy-900 dark:text-sky-100">Order Summary</h2>
      <div className="space-y-3">
        <SummaryRow label="Subtotal" value={subtotal} />
        <SummaryRow label="Shipping" value={shipping} />
        <div className="h-px bg-slate-100 dark:bg-sky-400/10" />
        <SummaryRow label="Total" value={total} bold />
      </div>
      {isLoaded && !isSignedIn ? (
        <SignInButton mode="modal" fallbackRedirectUrl="/cart">
          <button className={buttonClasses}>
            Sign in to Checkout
          </button>
        </SignInButton>
      ) : (
        <button className={buttonClasses}>
          Checkout
        </button>
      )}
      <p className="text-xs text-slate-400 dark:text-sky-400 text-center">
        Secure checkout powered by Stripe
      </p>
    </div>
  )
}