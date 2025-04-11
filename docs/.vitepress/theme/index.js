// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme-without-fonts'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'

import Layout from '../../@views/Layout.vue'

import Badge from '../../@components/Badge.vue'

import '@shikijs/vitepress-twoslash/style.css'

import './style.css'

export default {
  extends: Theme,
  Layout,
  enhanceApp ({ app }) {
    app.component('Badge', Badge)
    app.use(TwoslashFloatingVue)
  }
}
