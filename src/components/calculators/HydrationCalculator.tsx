import { useState } from 'react'
import { Droplets, Activity, Thermometer } from 'lucide-react'
import { cn } from '@/lib/utils'

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
type Climate = 'cool' | 'moderate' | 'hot' | 'very-hot'

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.0,
  light: 1.2,
  moderate: 1.4,
  active: 1.6,
  'very-active': 1.8,
}

const climateMultipliers: Record<Climate, number> = {
  cool: 1.0,
  moderate: 1.1,
  hot: 1.3,
  'very-hot': 1.5,
}

export function HydrationCalculator() {
  const [weight, setWeight] = useState<string>('')
  const [unit, setUnit] = useState<'lbs' | 'kg'>('lbs')
  const [activity, setActivity] = useState<ActivityLevel>('moderate')
  const [climate, setClimate] = useState<Climate>('moderate')
  const [result, setResult] = useState<number | null>(null)

  const calculateHydration = () => {
    const weightValue = parseFloat(weight)
    if (isNaN(weightValue) || weightValue <= 0) return

    // Convert to kg if needed
    const weightKg = unit === 'lbs' ? weightValue * 0.453592 : weightValue

    // Base calculation: 30-35ml per kg body weight
    const baseIntake = weightKg * 33

    // Apply multipliers
    const adjustedIntake =
      baseIntake * activityMultipliers[activity] * climateMultipliers[climate]

    // Convert to liters
    setResult(Math.round(adjustedIntake / 100) / 10)
  }

  return (
    <div className="bg-white/70 dark:bg-navy-800/70 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-sky-400/10 shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-sky-100 dark:bg-navy-700">
          <Droplets className="w-6 h-6 text-ocean-500 dark:text-ocean-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-navy-900 dark:text-sky-100">
            Hydration Calculator
          </h3>
          <p className="text-sm text-slate-500 dark:text-sky-300">
            Calculate your daily water intake
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Weight Input */}
        <div>
          <label className="block text-sm font-medium text-navy-800 dark:text-sky-200 mb-2">
            Your Weight
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={(e) => (e.key === '-' || e.key === 'e') && e.preventDefault()}
              placeholder="Enter weight"
              className={cn(
                'flex-1 px-4 py-3 rounded-xl',
                'bg-white dark:bg-navy-900 border border-slate-200 dark:border-sky-400/20',
                'text-navy-900 dark:text-sky-100 placeholder:text-slate-400 dark:placeholder:text-sky-400',
                'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500',
                'transition-all duration-200',
              )}
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'lbs' | 'kg')}
              className={cn(
                'px-4 py-3 rounded-xl',
                'bg-white dark:bg-navy-900 border border-slate-200 dark:border-sky-400/20',
                'text-navy-900 dark:text-sky-100',
                'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500',
              )}
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-navy-800 dark:text-sky-200 mb-2">
            <Activity className="inline w-4 h-4 mr-1" />
            Activity Level
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value as ActivityLevel)}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-white dark:bg-navy-900 border border-slate-200 dark:border-sky-400/20',
              'text-navy-900 dark:text-sky-100',
              'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500',
            )}
          >
            <option value="sedentary">Sedentary (little/no exercise)</option>
            <option value="light">Light (1-2 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="very-active">Very Active (intense daily)</option>
          </select>
        </div>

        {/* Climate */}
        <div>
          <label className="block text-sm font-medium text-navy-800 dark:text-sky-200 mb-2">
            <Thermometer className="inline w-4 h-4 mr-1" />
            Climate
          </label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value as Climate)}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-white dark:bg-navy-900 border border-slate-200 dark:border-sky-400/20',
              'text-navy-900 dark:text-sky-100',
              'focus:outline-none focus:ring-2 focus:ring-ocean-500/50 focus:border-ocean-500',
            )}
          >
            <option value="cool">Cool (below 60°F / 15°C)</option>
            <option value="moderate">Moderate (60-80°F / 15-27°C)</option>
            <option value="hot">Hot (80-95°F / 27-35°C)</option>
            <option value="very-hot">Very Hot (above 95°F / 35°C)</option>
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateHydration}
          className={cn(
            'w-full px-6 py-4 rounded-xl',
            'bg-ocean-500 hover:bg-ocean-600',
            'text-white font-semibold text-lg',
            'shadow-lg shadow-ocean-500/25',
            'hover:-translate-y-0.5 hover:shadow-xl',
            'transition-all duration-200',
          )}
        >
          Calculate My Intake
        </button>

        {/* Result */}
        {result !== null && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-ocean-50 dark:from-navy-700 dark:to-ocean-600/20 border border-sky-200 dark:border-ocean-400/30">
            <p className="text-sm text-slate-600 dark:text-sky-300 mb-1">
              Recommended Daily Intake
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-ocean-600 dark:text-ocean-400">{result}</span>
              <span className="text-xl text-slate-600 dark:text-sky-200">liters / day</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-sky-300 mt-2">
              That's about {Math.round(result * 4.2)} cups or{' '}
              {Math.round(result * 33.8)} oz
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
