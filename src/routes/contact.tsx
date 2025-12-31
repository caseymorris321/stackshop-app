import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Footer } from '@/components/layout/Footer'

const sendContactEmail = createServerFn({ method: 'POST' })
  .inputValidator((data: { name: string; email: string; message: string }) => data)
  .handler(async ({ data }) => {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: 'WatersLab Contact <onboarding@resend.dev>',
      to: 'morrisacasey@gmail.com',
      subject: `New Contact Form Message from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: data.email,
    })

    if (error) {
      throw new Error('Failed to send email')
    }

    return { success: true }
  })

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@waterslab.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'San Francisco, CA',
  },
]

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await sendContactEmail({ data: formData })
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider text-ocean-500">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mt-2">
              Contact Us
            </h1>
            <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
              Have questions about our products or need personalized hydration
              advice? We're here to help you perform at your best.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left - Contact Info */}
            <div className="space-y-8">
              {/* Contact Methods */}
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-3 rounded-xl bg-sky-50">
                      <item.icon className="w-5 h-5 text-ocean-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="font-medium text-navy-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional info */}
              <div className="p-6 rounded-2xl bg-navy-900 text-white">
                <h3 className="text-lg font-semibold mb-2">Office Hours</h3>
                <p className="text-white/80 text-sm">
                  Monday - Friday: 9am - 6pm PST
                  <br />
                  Saturday: 10am - 4pm PST
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Right - Contact Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-600">
                    We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-ocean-500 font-medium hover:text-ocean-600"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-navy-800 mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-xl',
                        'bg-slate-50 border border-slate-200',
                        'text-navy-900 placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500 focus:bg-white',
                        'transition-all duration-200',
                      )}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-navy-800 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className={cn(
                        'w-full px-4 py-3 rounded-xl',
                        'bg-slate-50 border border-slate-200',
                        'text-navy-900 placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500 focus:bg-white',
                        'transition-all duration-200',
                      )}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-navy-800 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={5}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl resize-none',
                        'bg-slate-50 border border-slate-200',
                        'text-navy-900 placeholder:text-slate-400',
                        'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500 focus:bg-white',
                        'transition-all duration-200',
                      )}
                      placeholder="How can we help you?"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full flex items-center justify-center gap-2',
                      'px-6 py-4 rounded-xl',
                      'bg-ocean-500 hover:bg-ocean-600',
                      'text-white font-semibold text-lg',
                      'shadow-lg shadow-ocean-500/25',
                      'hover:-translate-y-0.5 hover:shadow-xl',
                      'transition-all duration-200',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                      'cursor-pointer',
                    )}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
