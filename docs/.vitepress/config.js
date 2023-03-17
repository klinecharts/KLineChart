import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "KLineChart",
  description: "💹📈 可高度自定义的专业级轻量金融图表。",
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/'
    },
    fr: {
      label: 'English',
      lang: 'en-US', // optional, will be added  as `lang` attribute on `html` tag
      link: '/en-US/' // default /fr/ -- shows on navbar translations menu, can be external
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/images/logo.svg',
    nav: [
      { text: '指南', link: '/guide/what-is-klinechart' },
      { text: 'Playground', link: 'https://playground.klinecharts.com' },
      { text: '赞助', link: '/sponsor' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          collapsed: false,
          items: [
            { text: '什么是KLineChart？', link: '/guide/what-is-klinechart' },
            { text: '快速开始', link: '/guide/quick-start' }
          ]
        },
        {
          text: '基础篇',
          collapsed: false,
          items: [
            { text: '样式配置', link: '/guide/styles' },
            { text: '数据', link: '/guide/datasource' },
            { text: '环境要求', link: '/guide/environment' },
            { text: '快捷键', link: '/guide/hot-key' }
          ]
        },
        {
          text: '进阶篇',
          collapsed: false,
          items: [
            { text: '基础图形', link: '/guide/figure' },
            { text: '技术指标', link: '/guide/indicator' },
            { text: '覆盖物', link: '/guide/overlay' }
          ]
        },
        {
          text: 'API',
          collapsed: false,
          items: [
            { text: '图表API', link: '/guide/chart-api' },
            { text: '实例API', link: '/guide/instance-api' }
          ]
        },
        {
          text: '其它',
          collapsed: false,
          items: [
            { text: '常见问题', link: '/guide/faq' },
            { text: '从v8到v9', link: '/guide/v8-to-v9' },
            { text: '更新日志', link: '/guide/changelog' },
            { text: '反馈和共建', link: '/guide/feedback' }
          ]
        }
      ],
      '/en-US/guide/': [
        {
          text: 'Introduction',
          collapsed: false,
          items: [
            { text: '什么是KLineChart？', link: '/guide/what-is-klinechart' },
            { text: '快速开始', link: '/guide/quick-start' }
          ]
        },
        {
          text: '基础篇',
          collapsed: false,
          items: [
            { text: '样式配置', link: '/guide/styles' },
            { text: '数据', link: '/guide/datasource' },
            { text: '环境要求', link: '/guide/environment' },
            { text: '快捷键', link: '/guide/hot-key' }
          ]
        },
        {
          text: '进阶篇',
          collapsed: false,
          items: [
            { text: '基础图形', link: '/guide/figure' },
            { text: '技术指标', link: '/guide/indicator' },
            { text: '覆盖物', link: '/guide/overlay' }
          ]
        },
        {
          text: 'API',
          collapsed: false,
          items: [
            { text: '图表API', link: '/guide/chart-api' },
            { text: '实例API', link: '/guide/instance-api' }
          ]
        },
        {
          text: '其它',
          collapsed: false,
          items: [
            { text: '常见问题', link: '/guide/faq' },
            { text: '从v8到v9', link: '/guide/v8-to-v9' },
            { text: '更新日志', link: '/guide/changelog' },
            { text: '反馈和共建', link: '/guide/feedback' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer: {
      message: 'Released under the Apache License V2.',
      copyright: 'Copyright © 2018-present liihuu'
    }
  }
})
