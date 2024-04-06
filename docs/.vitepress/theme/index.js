// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'

import Layout from './Layout.vue'

import Badge from '../components/Badge.vue'

import './style.css'

export default {
  extends: Theme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component('Badge', Badge)
    // ...
  }
}
