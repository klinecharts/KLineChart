import { defineConfig } from 'vitepress'

import path from 'path'

import pkg from '../../package.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'KLineChart',
  description: '💹📈 可高度自定义的专业级轻量金融图表。',
  outDir: '../website',
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' }],
  ],
  vue: {
    reactivityTransform: true,
  },
  vite: {
    resolve: {
      alias: {
        './VPNavBarSearch.vue': path.join(__dirname, 'components', 'search', 'NavBarSearch.vue')
      }
    }
  },
  transformHead: () => {
    return [
      [
        'script',
        {},
        `var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?f5f0d6d79a8fb0825e285ab72dc542cb";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();`
      ]
    ]
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/what-is-klinechart', activeMatch: 'guide' },
          { text: 'Pro', link: 'https://pro.klinecharts.com' },
          { text: '预览', link: 'https://preview.klinecharts.com' },
          { text: '赞助', link: '/sponsor' },
          { text: '找工作', link: 'https://www.bolejobs.co' },
          {
            text: `V${pkg.version}`,
            items: [{ text: 'V8 文档', link: 'https://v8.klinecharts.com/zh-CN' }]
          },
        ],
        sidebar: {
          '/guide/': [
            {
              text: '介绍',
              collapsed: false,
              items: [
                { text: '什么是KLineChart？', link: '/guide/what-is-klinechart' },
                { text: '快速开始', link: '/guide/getting-started' }
              ]
            },
            {
              text: '基础篇',
              collapsed: false,
              items: [
                { text: '样式配置', link: '/guide/styles' },
                { text: '数据', link: '/guide/datasource' },
                { text: '环境要求', link: '/guide/environment' },
                { text: '快捷键', link: '/guide/hot-key' },
                { text: '国际化', link: '/guide/i18n' }
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
        },
        docFooter: {
          prev: '上一篇',
          next: '下一篇'
        },
        editLink: {
          pattern: 'https://github.com/liihuu/KLineChart/edit/main/docs/:path',
          text: '为此页提供修改建议'
        },
        lastUpdatedText: '最后更新时间',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        outlineTitle: '本页目录'
      }
    },
    'en-US': {
      label: 'English',
      lang: 'en-US',
      link: '/en-US/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en-US/guide/what-is-klinechart', activeMatch: 'guide' },
          { text: 'Pro', link: 'https://pro.klinecharts.com/en-US' },
          { text: 'Preview', link: 'https://preview.klinecharts.com/en-US' },
          { text: 'Sponsor', link: '/en-US/sponsor' },
          { text: 'Jobs', link: 'https://www.bolejobs.co' },
          {
            text: `V${pkg.version}`,
            items: [{ text: 'V8 Docs', link: 'https://v8.klinecharts.com' }]
          },
        ],
        sidebar: {
          '/en-US/guide/': [
            {
              text: 'Introduction',
              collapsed: false,
              items: [
                { text: 'What is KLineChart?', link: '/en-US/guide/what-is-klinechart' },
                { text: 'Getting Started', link: '/en-US/guide/getting-started' }
              ]
            },
            {
              text: 'Basic',
              collapsed: false,
              items: [
                { text: 'Style Configuration', link: '/en-US/guide/styles' },
                { text: 'Datasource', link: '/en-US/guide/datasource' },
                { text: 'Environment', link: '/en-US/guide/environment' },
                { text: 'Hot Key', link: '/en-US/guide/hot-key' },
                { text: 'Internationalization', link: '/en-US//guide/i18n' }
              ]
            },
            {
              text: 'Advanced',
              collapsed: false,
              items: [
                { text: 'Figure', link: '/en-US/guide/figure' },
                { text: 'Indicator', link: '/en-US/guide/indicator' },
                { text: 'Overlay', link: '/en-US/guide/overlay' }
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
                { text: 'FAQ', link: '/en-US/guide/faq' },
                { text: 'V8 To V9', link: '/en-US/guide/v8-to-v9' },
                { text: 'Changelog', link: '/en-US/guide/changelog' },
                { text: 'Feedback', link: '/en-US/guide/feedback' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/liihuu/KLineChart/edit/main/docs/:path'
        }
      }
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/images/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/liihuu/KLineChart' }
    ],
    footer: {
      message: 'Released under the Apache License V2.',
      copyright: 'Copyright © 2018-present liihuu'
    }
  }
})
