// From https://github.com/mattjcowan/vitepress/blob/with-lunr-search/docs/components/search/VPLunrSearchBox.vue

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute, useData } from 'vitepress'
import { lunrSearch } from './lunrSearch'

const router = useRouter()
const route = useRoute()
const { theme, site } = useData()

onMounted(() => {
  initialize(theme.value.algolia)
  setTimeout(poll, 16)
})

function poll() {
  // programmatically open the search box after initialize
  const e = new Event('keydown')

  e.key = 'k'
  e.metaKey = true

  window.dispatchEvent(e)

  setTimeout(() => {
    if (!document.querySelector('.DocSearch-Modal')) {
      poll()
    }
  }, 16)
}

function initialize(userOptions) {
  // note: multi-lang search support is removed since the theme
  // doesn't support multiple locales as of now.
  const options = Object.assign({}, userOptions, {
    container: '#docsearch',

    navigator: {
      navigate({ itemUrl }) {
        const { pathname: hitPathname } = new URL(window.location.origin + itemUrl)

        // router doesn't handle same-page navigation so we use the native
        // browser location API for anchor navigation
        if (route.path === hitPathname) {
          window.location.assign(window.location.origin + itemUrl)
        } else {
          router.go(itemUrl)
        }
      }
    },

    transformItems(items) {
      return items.map(item => Object.assign({}, item, { url: getRelativePath(item.url)}))
    },

    hitComponent({ hit, children }) {
      return {
        __v: null,
        type: 'a',
        ref: undefined,
        constructor: undefined,
        key: undefined,
        props: { href: hit.url, children }
      }
    }
  })

  lunrSearch(options)
}

function getRelativePath(absoluteUrl) {
  const { pathname, hash } = new URL(absoluteUrl)
  return (
    pathname.replace(
      /\.html$/,
      site.value.cleanUrls === 'disabled' ? '.html' : ''
    ) + hash
  )
}
</script>

<template>
    <div id="docsearch" />
</template>


<style>
.DocSearch-Logo {
  visibility: hidden !important;
}

.DocSearch-NoResults-Prefill-List {
  display: none !important;
}
</style>