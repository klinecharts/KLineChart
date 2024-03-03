// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'

import HomeSponsor from '../components/HomeSponsor.vue'
import NotFound from '../components/NotFound.vue'
import Tag from '../components/Tag.vue'

import './style.css'

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-features-after': () => h(HomeSponsor),
      'not-found': () => h(NotFound)
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Tag', Tag)
    // ...
  }
}
