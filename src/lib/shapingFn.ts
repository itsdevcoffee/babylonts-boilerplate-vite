export function smoothStep(edge0: number, edge1: number, x: number) {
  // Clamp x to the range [0, 1]
  x = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))

  // Evaluate the smoothstep function
  return x * x * (3 - 2 * x)
}

export function getAbsHighestEdge(...edges: number[]) {
  let currHighest = 0
  let absEdge = 0
  edges.forEach(edge => {
    if (Math.abs(edge) > currHighest) {
      currHighest = Math.abs(edge)
      absEdge = edge
    }
  })

  return absEdge
}
