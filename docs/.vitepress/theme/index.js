// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'

import Layout from './Layout.vue'

import Tag from '../components/Tag.vue'

import './style.css'

export default {
  extends: Theme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component('Tag', Tag)
    // ...
  }
}
