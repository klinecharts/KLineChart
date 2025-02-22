import { defineConfig } from 'vitepress'
import { getChartApiMenus, getInstanceApiMenus, version } from './share'

export default defineConfig({
  label: '🇬🇧 English',
  lang: 'en-US',
  description: '💹📈 Highly customizable professional lightweight financial chart.',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/en-US/guide/introduction', activeMatch: 'guide' },
      {
        text: 'API',
        activeMatch: 'api',
        items: [
          { text: 'Chart API', link: '/en-US/api/chart/init' },
          { text: 'Instance API', link: '/en-US/api/instance/getDom' }
        ]
      },
      { text: 'Pro', link: 'https://pro.klinecharts.com/en-US' },
      { text: 'Preview', link: 'https://preview.klinecharts.com/#en-US' },
      { text: 'Customize', link: '/en-US/customize' },
      { text: 'Sponsor', link: '/en-US/sponsor' },
      {
        text: `${version}`,
        items: [
          { text: '9.x Docs', link: 'https://v9.klinecharts.com/en-US' },
          { text: '8.x Docs', link: 'https://v8.klinecharts.com' }
        ]
      }
    ],
    sidebar: {
      '/en-US/guide/': [
        {
          text: 'Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/en-US/guide/introduction' },
            { text: 'Quick Start', link: '/en-US/guide/quick-start' }
          ]
        },
        {
          text: 'Basic',
          collapsed: false,
          items: [
            { text: 'Style Configuration', link: '/en-US/guide/styles' },
            { text: 'Data Source', link: '/en-US/guide/data-source' },
            { text: 'Internationalization', link: '/en-US/guide/i18n' },
            { text: 'Environment', link: '/en-US/guide/environment' },
            { text: 'Hot Key', link: '/en-US/guide/hot-key' }
          ]
        },
        {
          text: 'Advanced',
          collapsed: false,
          items: [
            { text: 'Figure', link: '/en-US/guide/figure' },
            { text: 'Indicator', link: '/en-US/guide/indicator' },
            { text: 'Overlay', link: '/en-US/guide/overlay' },
            { text: 'Local Development', link: '/en-US/guide/local-development' }
          ]
        },
        {
          text: 'Others',
          collapsed: false,
          items: [
            { text: '9.x to 10.x', link: '/en-US/guide/v9-to-v10' },
            { text: 'FAQ', link: '/en-US/guide/faq' },
            { text: 'Feedback', link: '/en-US/guide/feedback' },
            { text: 'Changelog', link: '/en-US/guide/changelog' }
          ]
        }
      ],
      '/en-US/api/chart/': getChartApiMenus('/en-US'),
      '/en-US/api/instance/': getInstanceApiMenus('/en-US')
    },
    editLink: {
      pattern: 'https://github.com/klinecharts/KLineChart/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})

export const search = {
  'en-US': {
    placeholder: 'Search docs',
    translations: {
      button: {
        buttonText: 'Search',
        buttonAriaLabel: 'Search'
      },
      modal: {
        noResultsText: 'No results for',
        resetButtonTitle: 'Reset search',
        footer: {
          selectText: 'to select',
          navigateText: 'to navigate',
          closeText: 'to close'
        }
      }
    }
  }
}
