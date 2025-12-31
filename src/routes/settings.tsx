import { createFileRoute } from '@tanstack/react-router'
import { UserProfile, useUser } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { WaterDropLoader } from '@/components/ui/water-drop-loader'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <WaterDropLoader size="lg" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-slate-600 mb-4">Please sign in to access settings.</p>
          <Link
            to="/login"
            className="text-ocean-600 hover:text-ocean-700 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-ocean-600 hover:text-ocean-700 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <UserProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-lg w-full max-w-none',
            },
          }}
        />
      </div>
    </div>
  )
}
