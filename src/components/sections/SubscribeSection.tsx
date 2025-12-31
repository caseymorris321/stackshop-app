import { useState } from 'react'
import { Sparkles, Check } from 'lucide-react'
import { createServerFn } from '@tanstack/react-start'
import { cn } from '@/lib/utils'

const sendSubscribeEmail = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: 'WatersLab <onboarding@resend.dev>',
      to: 'morrisacasey@gmail.com',
      subject: 'New Newsletter Subscriber!',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p>This person wants to receive the 15% off code and newsletter updates.</p>
      `,
    })

    if (error) {
      throw new Error('Failed to send email')
    }

    return { success: true }
  })

export function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await sendSubscribeEmail({ data: { email } })
      setSubmitted(true)
      setEmail('')
    } catch (err) {
      console.error('Failed to subscribe:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-ocean-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
          <Sparkles size={16} className="text-sky-300" />
          <span className="text-sm font-medium text-white/90">
            Subscribe & Save 15%
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Stay Hydrated, Save Money
        </h2>
        <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
          Join our newsletter and get 15% off your first order. Plus, receive
          exclusive hydration tips, new product alerts, and member-only deals.
        </p>

        {/* Form */}
        {submitted ? (
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <Check size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">You're on the list!</p>
              <p className="text-sm text-white/70">
                Check your email for your 15% off code.
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className={cn(
                'flex-1 px-5 py-4 rounded-xl',
                'bg-white/10 backdrop-blur-sm',
                'border border-white/20',
                'text-white placeholder:text-white/50',
                'focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400',
                'transition-all duration-200',
              )}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'px-8 py-4 rounded-xl',
                'bg-white text-navy-900',
                'font-semibold',
                'shadow-lg',
                'hover:-translate-y-0.5 hover:shadow-xl',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                'cursor-pointer',
              )}
            >
              {isSubmitting ? 'Subscribing...' : 'Get 15% Off'}
            </button>
          </form>
        )}

        {/* Trust indicators */}
        <p className="text-sm text-white/50 mt-6">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
