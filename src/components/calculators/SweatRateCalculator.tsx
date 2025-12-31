import { useState } from 'react'
import { Zap, Timer, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SweatRateCalculator() {
  const [preWeight, setPreWeight] = useState<string>('')
  const [postWeight, setPostWeight] = useState<string>('')
  const [fluidIntake, setFluidIntake] = useState<string>('')
  const [duration, setDuration] = useState<string>('')
  const [unit, setUnit] = useState<'lbs' | 'kg'>('lbs')
  const [result, setResult] = useState<{
    sweatRate: number
    recommendation: string
  } | null>(null)

  const calculateSweatRate = () => {
    const pre = parseFloat(preWeight)
    const post = parseFloat(postWeight)
    const fluid = parseFloat(fluidIntake) || 0
    const hours = parseFloat(duration)

    if (isNaN(pre) || isNaN(post) || isNaN(hours) || hours <= 0) return

    // Convert to kg if needed
    const preKg = unit === 'lbs' ? pre * 0.453592 : pre
    const postKg = unit === 'lbs' ? post * 0.453592 : post
    // Fluid in liters (assuming oz if lbs, ml if kg)
    const fluidLiters = unit === 'lbs' ? fluid * 0.0296 : fluid / 1000

    // Sweat rate formula: (pre - post + fluid) / hours
    const sweatLoss = preKg - postKg + fluidLiters
    const sweatRate = sweatLoss / hours

    let recommendation = ''
    if (sweatRate < 0.5) {
      recommendation = 'Light sweater - Standard hydration should suffice.'
    } else if (sweatRate < 1.0) {
      recommendation = 'Moderate sweater - Consider electrolyte drinks during longer sessions.'
    } else if (sweatRate < 1.5) {
      recommendation = 'Heavy sweater - Use electrolyte supplements during and after exercise.'
    } else {
      recommendation = 'Very heavy sweater - Prioritize sodium-rich electrolytes and frequent fluid intake.'
    }

    setResult({
      sweatRate: Math.round(sweatRate * 100) / 100,
      recommendation,
    })
  }

  return (
    <div className="bg-white/70 dark:bg-navy-800/70 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-sky-400/10 shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-orange-100 dark:bg-orange-500/20">
          <Zap className="w-6 h-6 text-orange-500 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-navy-900 dark:text-sky-100">
            Sweat Rate Calculator
          </h3>
          <p className="text-sm text-slate-500 dark:text-sky-300">
            Measure fluid loss during exercise
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Unit Toggle */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-navy-900 rounded-lg">
          <button
            onClick={() => setUnit('lbs')}
            className={cn(
              'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
              unit === 'lbs'
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-sky-100 shadow-sm'
                : 'text-slate-600 dark:text-sky-300 hover:text-navy-900 dark:hover:text-sky-100',
            )}
          >
            Imperial (lbs/oz)
          </button>
          <button
            onClick={() => setUnit('kg')}
            className={cn(
              'flex-1 py-2 rounded-md text-sm font-medium transition-colors',
              unit === 'kg'
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-sky-100 shadow-sm'
                : 'text-slate-600 dark:text-sky-300 hover:text-navy-900 dark:hover:text-sky-100',
            )}
          >
            Metric (kg/ml)
          </button>
        </div>

        {/* Pre-Exercise Weight */}
        <div>
          <label className="block text-sm font-medium text-navy-800 dark:text-sky-200 mb-2">
            <Scale className="inline w-4 h-4 mr-1" />
            Weight Before Exercise ({unit})
          </label>
          <input
            type="number"
            min="0"
            value={preWeight}
            onChange={(e) => setPreWeight(e.target.value)}
            onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
            placeholder={`e.g., ${unit === 'lbs' ? '165' : '75'}`}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-white dark:bg-navy-900 border border-slate-200 dark:border-sky-400/20',
              'text-navy-900 dark:text-sky-100 placeholder:text-slate-400 dark:placeholder:text-sky-400',
              'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500',
            )}
          />
        </div>

        {/* Post-Exercise Weight */}
        <div>
          <label className="block text-sm font-medium text-navy-800 dark:text-sky-200 mb-2">
            <Scale className="inline w-4 h-4 mr-1" />
            Weight After Exercise ({unit})
          </label>
          <input
            type="number"
            min="0"
            value={postWeight}
            onChange={(e) => setPostWeight(e.target.value)}
            onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
            placeholder={`e.g., ${unit === 'lbs' ? '163' : '74'}`}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-white dark:bg-navy-900 border border-slate-200 dark:border-sky-400/20',
              'text-navy-900 dark:text-sky-100 placeholder:text-slate-400 dark:placeholder:text-sky-400',
              'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500',
            )}
          />
        </div>

        {/* Fluid Consumed */}
        <div>
          <label className="block text-sm font-medium text-navy-800 dark:text-sky-200 mb-2">
            Fluid Consumed During ({unit === 'lbs' ? 'oz' : 'ml'})
          </label>
          <input
            type="number"
            min="0"
            value={fluidIntake}
            onChange={(e) => setFluidIntake(e.target.value)}
            onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
            placeholder={`e.g., ${unit === 'lbs' ? '16' : '500'}`}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-white dark:bg-navy-900 border border-slate-200 dark:border-sky-400/20',
              'text-navy-900 dark:text-sky-100 placeholder:text-slate-400 dark:placeholder:text-sky-400',
              'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500',
            )}
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-navy-800 dark:text-sky-200 mb-2">
            <Timer className="inline w-4 h-4 mr-1" />
            Exercise Duration (hours)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.25"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
            placeholder="e.g., 1.5"
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-white dark:bg-navy-900 border border-slate-200 dark:border-sky-400/20',
              'text-navy-900 dark:text-sky-100 placeholder:text-slate-400 dark:placeholder:text-sky-400',
              'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500',
            )}
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateSweatRate}
          className={cn(
            'w-full px-6 py-4 rounded-xl',
            'bg-orange-500 hover:bg-orange-600',
            'text-white font-semibold text-lg',
            'shadow-lg shadow-orange-500/25',
            'hover:-translate-y-0.5 hover:shadow-xl',
            'transition-all duration-200',
          )}
        >
          Calculate Sweat Rate
        </button>

        {/* Result */}
        {result !== null && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/20 dark:to-amber-500/10 border border-orange-200 dark:border-orange-400/30">
            <p className="text-sm text-slate-600 dark:text-sky-300 mb-1">Your Sweat Rate</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {result.sweatRate}
              </span>
              <span className="text-xl text-slate-600 dark:text-sky-200">L / hour</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-sky-200 bg-white/50 dark:bg-navy-900/50 rounded-lg p-3">
              {result.recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
