export function isRgba (color: string): boolean {
  return (/^[rR][gG][Bb][Aa][\\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\s]*,){3}[\s]*(1|1.0|0|0.[0-9])[\s]*[\\)]{1}$/).test(color)
}

export function isHsla (color: string): boolean {
  return (/^[hH][Ss][Ll][Aa][\\(]([\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\s]*,)([\s]*((100|[0-9][0-9]?)%|0)[\s]*,){2}([\s]*(1|1.0|0|0.[0-9])[\s]*)[\\)]$/).test(color)
}

export function isTransparent (color: string): boolean {
  return color === 'transparent' ||
    color === 'none' ||
    (isRgba(color) && parseFloat((color.match(/(\d(\.\d+)?)+/g) ?? [])[3]) === 0) ||
    (isHsla(color) && parseFloat((color.match(/(\d(\.\d+)?)+/g) ?? [])[3]) === 0)
}
