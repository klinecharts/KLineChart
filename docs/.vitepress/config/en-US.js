import { defineConfig } from 'vitepress'

import pkg from '../../../package.json'

export default defineConfig({
  label: '🇬🇧 English',
  lang: 'en-US',
  description: '💹📈 Highly customizable professional lightweight financial chart.',
  themeConfig: {
    nav: [
      { text: 'Docs', link: '/en-US/guide/introduction', activeMatch: 'guide' },
      { text: 'Sample', link: '/en-US/sample/basic', activeMatch: 'sample' },
      { text: 'Preview', link: 'https://preview.klinecharts.com/#en-US' },
      { text: 'Customize', link: '/en-US/customize' },
      { text: 'Sponsor', link: '/en-US/sponsor' },
      {
        text: 'More',
        items: [
          {
            text: 'Resources',
            items: [
              { text: 'Pro', link: 'https://pro.klinecharts.com/en-US' },
              { text: 'Extension(Under construction)', link: 'https://klinecharts.com/en-US' }
            ]
          },
          {
            text: 'Development Guide',
            items: [
              { text: 'Local Development', link: '/en-US/more/local-development' },
            ]
          },
          {
            text: 'Community',
            items: [
              { text: 'FAQ', link: '/en-US/more/faq' },
              { text: 'Feedback', link: '/en-US/more/feedback' }
            ]
          }
        ]
      },
      {
        text: `V${pkg.version}`,
        items: [{ text: 'V8 Docs', link: 'https://v8.klinecharts.com' }]
      },
    ],
    sidebar: {
      '/en-US/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/en-US/guide/introduction' },
            { text: 'Quick Start', link: '/en-US/guide/quick-start' },
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
            { text: 'Custom Axis', link: '/en-US/guide/custom-axis' }
          ]
        },
        {
          text: 'API',
          collapsed: false,
          items: [
            { text: 'Chart API', link: '/en-US/guide/chart-api' },
            { text: 'Instance API', link: '/en-US/guide/instance-api' }
          ]
        },
        {
          text: 'Others',
          collapsed: false,
          items: [
            { text: 'V8 To V9', link: '/en-US/guide/v8-to-v9' },
            { text: 'Changelog', link: '/en-US/guide/changelog' }
          ]
        }
      ],
      '/en-US/sample/': [
        { text: 'Basic', link: '/en-US/sample/basic' },
        { text: 'Candle Type', link: '/en-US/sample/candle-type' },
        { text: 'Indicator', link: '/en-US/sample/indicator' },
        { text: 'Axis', link: '/en-US/sample/axis' },
        { text: 'Tooltip', link: '/en-US/sample/tooltip' },
        { text: 'Overlay', link: '/en-US/sample/overlay' },
        { text: 'Data', link: '/en-US/sample/data' },
        { text: 'Theme', link: '/en-US/sample/theme' },
        { text: 'Timezone', link: '/en-US/sample/timezone' },
        { text: 'I18n', link: '/en-US/sample/i18n' },
      ]
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
          closeText: 'to close',
        }
      }
    }
  }
}