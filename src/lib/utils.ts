export function hexToDecimalColor(hex: string): [number, number, number] {
  // Remove the hash at the beginning if it's there
  hex = hex.replace(/^#/, '')

  // Parse the hex string
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Convert to decimal (normalized to 1)
  return [r / 255, g / 255, b / 255]
}
