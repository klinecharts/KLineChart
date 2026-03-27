export const THEME_COLOR_STORAGE_KEY = 'klinecharts-primary-color'
export const THEME_COLOR_STYLE_ID = 'klinecharts-theme-color-style'
export const DEFAULT_THEME_COLOR = '#E6AC00'

export function normalizeThemeColor (color) {
  if (typeof color !== 'string') {
    return null
  }
  const value = color.trim()
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toUpperCase() : null
}

export function lightenThemeColor (color, percent) {
  const normalized = color.replace(/^#/, '')

  let r = parseInt(normalized.substring(0, 2), 16)
  let g = parseInt(normalized.substring(2, 4), 16)
  let b = parseInt(normalized.substring(4, 6), 16)

  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))

  return (
    '#' +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
  )
}

export function themeColorToRgba (hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function createThemeColorStyleText (color) {
  const targetColor = normalizeThemeColor(color) || DEFAULT_THEME_COLOR
  return `
:root {
  --vp-c-indigo-1: ${targetColor};
  --vp-c-indigo-2: ${lightenThemeColor(targetColor, 20)};
  --vp-c-indigo-3: ${lightenThemeColor(targetColor, 40)};
  --vp-home-hero-bg:
    radial-gradient(circle at 50% 0%, ${themeColorToRgba(targetColor, 0.12)} 0%, transparent 34%),
    radial-gradient(circle at 18% 24%, ${themeColorToRgba(targetColor, 0.05)} 0%, transparent 24%),
    radial-gradient(circle at 82% 22%, ${themeColorToRgba(targetColor, 0.04)} 0%, transparent 26%),
    linear-gradient(180deg, ${themeColorToRgba(targetColor, 0.025)} 0%, transparent 60%);
}`
}

export function applyThemeColorStyle (color, doc = document) {
  const styleText = createThemeColorStyleText(color)
  let style = doc.getElementById(THEME_COLOR_STYLE_ID)
  if (!style) {
    style = doc.createElement('style')
    style.id = THEME_COLOR_STYLE_ID
    doc.head.appendChild(style)
  }
  style.textContent = styleText
}

export function getThemeColorInitScript () {
  return `(function () {
  var STORAGE_KEY = '${THEME_COLOR_STORAGE_KEY}'
  var STYLE_ID = '${THEME_COLOR_STYLE_ID}'
  var DEFAULT_COLOR = '${DEFAULT_THEME_COLOR}'

  function normalizeColor (color) {
    if (typeof color !== 'string') {
      return null
    }
    var value = color.trim()
    return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toUpperCase() : null
  }

  function lighten (color, percent) {
    color = color.replace(/^#/, '')
    var r = parseInt(color.substring(0, 2), 16)
    var g = parseInt(color.substring(2, 4), 16)
    var b = parseInt(color.substring(4, 6), 16)

    r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
    g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
    b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))

    return '#' + [r, g, b].map(function (x) {
      return x.toString(16).padStart(2, '0')
    }).join('')
  }

  function hexToRgba (hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16)
    var g = parseInt(hex.slice(3, 5), 16)
    var b = parseInt(hex.slice(5, 7), 16)

    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
  }

  function createStyleText (color) {
    var targetColor = normalizeColor(color) || DEFAULT_COLOR
    return ':root {' +
      '--vp-c-indigo-1: ' + targetColor + ';' +
      '--vp-c-indigo-2: ' + lighten(targetColor, 20) + ';' +
      '--vp-c-indigo-3: ' + lighten(targetColor, 40) + ';' +
      '--vp-home-hero-bg:' +
        'radial-gradient(circle at 50% 0%, ' + hexToRgba(targetColor, 0.12) + ' 0%, transparent 34%),' +
        'radial-gradient(circle at 18% 24%, ' + hexToRgba(targetColor, 0.05) + ' 0%, transparent 24%),' +
        'radial-gradient(circle at 82% 22%, ' + hexToRgba(targetColor, 0.04) + ' 0%, transparent 26%),' +
        'linear-gradient(180deg, ' + hexToRgba(targetColor, 0.025) + ' 0%, transparent 60%);' +
    '}'
  }

  try {
    var color = normalizeColor(window.localStorage.getItem(STORAGE_KEY)) || DEFAULT_COLOR
    var style = document.getElementById(STYLE_ID)
    if (!style) {
      style = document.createElement('style')
      style.id = STYLE_ID
      document.head.appendChild(style)
    }
    style.textContent = createStyleText(color)
  } catch (error) {}
})()`
}
