// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'

import WhoAreUse from '../components/WhoAreUse.vue'

import './style.css'

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 'home-features-after': h(QuickInit)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('WhoAreUse', WhoAreUse)
  }
}
