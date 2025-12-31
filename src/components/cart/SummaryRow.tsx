export function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string
  value: number
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-semibold text-navy-900 dark:text-sky-100' : 'text-slate-600 dark:text-sky-300'}>
        {label}
      </span>
      <span className={bold ? 'text-lg font-bold text-navy-900 dark:text-sky-100' : 'font-semibold text-navy-800 dark:text-sky-200'}>
        ${value.toFixed(2)}
      </span>
    </div>
  )
}