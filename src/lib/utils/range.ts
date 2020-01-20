export const isValidDate = (date: Date | number): date is Date => {
  return ((date as Date) instanceof Date && !isNaN(date as number))
}

export const getDataMin = (data: Array<{ x: number | Date, y: number }>): number => {
  const dataMin = Math.min.apply(Math, data.map(dataPoint => dataPoint.y))
  if (isNaN(dataMin) || !isFinite(dataMin) || dataMin >= 0) {
    return 0
  }
  return dataMin
}

export const getDataMax = (data: Array<{ x: number | Date, y: number }>): number => {
  const dataMax = Math.max.apply(Math, data.map(dataPoint => dataPoint.y))
  if (isNaN(dataMax) || !isFinite(dataMax) || dataMax <= 0) {
    return 1
  }
  return dataMax
}