export function nice (value) {
  const exponent = Math.floor(Math.log(value) / Math.log(10.0))
  const exp10 = Math.pow(10.0, exponent)
  const f = value / exp10 // 1 <= f < 10
  let nf = 0
  if (f < 1) {
    nf = 1
  } else if (f < 2) {
    nf = 2
  } else if (f < 3) {
    nf = 3
  } else if (f < 5) {
    nf = 5
  } else {
    nf = 10
  }
  value = nf * exp10
  return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value
}

export function getIntervalPrecision (value) {
  const str = value.toString()

  // Consider scientific notation: '3.4e-12' '3.4e+12'
  const eIndex = str.indexOf('e')
  if (eIndex > 0) {
    const precision = +str.slice(eIndex + 1)
    return precision < 0 ? -precision : 0
  } else {
    const dotIndex = str.indexOf('.')
    return dotIndex < 0 ? 0 : str.length - 1 - dotIndex
  }
}

export function round (x, precision) {
  if (precision == null) {
    precision = 10
  }
  // Avoid range error
  precision = Math.min(Math.max(0, precision), 20)
  x = (+x).toFixed(precision)
  return x
}
