export default function SVGPathYFromX(path: any, x: number): number {

  // Path can be null from svg-path-properties
  if (path == null) { return 0 }

  /**
   * If we only essentially have one position, including the same
   * position multiple times, then we don't have a line length and
   * should return 0 as calling getPointAtLength on a path of 0
   * length causes a crash.
   */
  const pathLength = path.getTotalLength()
  if (pathLength === 0) { return 0 }

  /**
   * We can narrow the search by starting the search at the
   * shortest distance, i.e. a straight line
   */
  let start = x - pathLength
  let end = pathLength
  let target = (start + end) / 2

  // Ensure that x is within the range of the path
  x = Math.max(x, path.getPointAtLength(0).x)
  x = Math.min(x, path.getPointAtLength(pathLength).x)

  /**
   * Walk along the path using binary search
   * to locate the point with the supplied x value
   */
  while (target >= start && target <= pathLength) {
    const pos = path.getPointAtLength(target)

    /**
     * Use a threshold instead of strict equality
     * to handle javascript floating point precision
     */
    if (Math.abs(pos.x - x) < 0.1) {
      return pos.y
    } else if (pos.x > x) {
      end = target
    } else {
      start = target
    }
    target = (start + end) / 2
  }
  return path.getPointAtLength(0)
}
