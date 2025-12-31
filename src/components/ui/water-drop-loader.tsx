import { cn } from '@/lib/utils'

interface WaterDropLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function WaterDropLoader({ size = 'md', className }: WaterDropLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <svg
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size], 'animate-spin')}
        style={{ animationDuration: '1.2s' }}
      >
        {/* Outer ring */}
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#E0F2FE"
          strokeWidth="4"
        />
        {/* Spinning arc */}
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="url(#spinnerGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80 126"
        />
        {/* Center droplet icon */}
        <path
          d="M25 15C25 15 19 23 19 27C19 30.314 21.686 33 25 33C28.314 33 31 30.314 31 27C31 23 25 15 25 15Z"
          fill="url(#dropletGradient)"
        />
        <defs>
          <linearGradient
            id="spinnerGradient"
            x1="0"
            y1="0"
            x2="50"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0EA5E9" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient
            id="dropletGradient"
            x1="25"
            y1="15"
            x2="25"
            y2="33"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

interface WaterDropLoadingScreenProps {
  message?: string
}

export function WaterDropLoadingScreen({ message = 'Loading...' }: WaterDropLoadingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white">
      <WaterDropLoader size="lg" />
      <p className="mt-4 text-navy-800 font-medium">{message}</p>
    </div>
  )
}
