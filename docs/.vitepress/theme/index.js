// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'

import Layout from './Layout.vue'

import Badge from '../components/Badge.vue'

import '@shikijs/vitepress-twoslash/style.css'

import './style.css'

export default {
  extends: Theme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue)
    app.component('Badge', Badge)
    // ...
  }
}
