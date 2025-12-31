import { HydrationCalculator } from '../calculators/HydrationCalculator'
import { SweatRateCalculator } from '../calculators/SweatRateCalculator'

export function CalculatorsSection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-sky-50 to-white dark:from-navy-900 dark:to-navy-950">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-sky-100">
            Calculate Your Hydration Needs
          </h2>
          <p className="text-lg text-slate-600 dark:text-sky-200 mt-4 max-w-2xl mx-auto">
            Use our science-based calculators to understand your body's unique
            hydration requirements and optimize your performance.
          </p>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HydrationCalculator />
          <SweatRateCalculator />
        </div>
      </div>
    </section>
  )
}
