export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function calculateAverage(values: (number | null)[]): number | null {
  const validValues = values.filter((v): v is number => v !== null)
  if (validValues.length === 0) return null
  return validValues.reduce((sum, val) => sum + val, 0) / validValues.length
}
