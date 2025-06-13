import zhCN from './zh-CN.json'
import enUS from './en-US.json'

const locales = {
  'zh-CN': zhCN,
  'en-US': enUS
}

export default function i18n (key, locale = 'zh-CN') {
  return (locales[locale] || {})[key] || key
}
