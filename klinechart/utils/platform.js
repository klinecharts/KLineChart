export function isIPad (ua) {
  return ua.match(/(iPad).*OS\s([\d_]+)/)
}

export function isIPhone (ua) {
  return !isIPad(ua) && ua.match(/(iPhone\sOS)\s([\d_]+)/)
}

export function isAndroid (ua) {
  // eslint-disable-next-line no-useless-escape
  return ua.match(/(Android);?[\s\/]+([\d.]+)?/)
}

export function isMobile (ua) {
  return isIPad(ua) || isIPhone(ua) || isAndroid(ua)
}
