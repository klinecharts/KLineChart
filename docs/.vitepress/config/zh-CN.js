import { defineConfig } from 'vitepress'

import { getChartApiMenus, getInstanceApiMenus, version } from './share'

export default defineConfig({
  label: '🇨🇳 简体中文',
  lang: 'zh-CN',
  description: '💹📈 可高度自定义的专业级轻量金融图表。',
  themeConfig: {
    nav: [
      {
        text: '指南',
        link: '/guide/introduction',
        activeMatch: 'guide'
      },
      {
        text: 'API',
        activeMatch: 'api',
        items: [
          { text: '图表API', link: '/api/chart/init' },
          { text: '实例API', link: '/api/instance/getDom' }
        ]
      },
      { text: 'Pro', link: 'https://pro.klinecharts.com' },
      { text: '预览', link: 'https://preview.klinecharts.com' },
      { text: '定制', link: '/customize' },
      { text: '赞助', link: '/sponsor' },
      {
        text: `${version}`,
        items: [
          { text: '9.x 文档', link: 'https://v9.klinecharts.com' },
          { text: '8.x 文档', link: 'https://v8.klinecharts.com/zh-CN' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          collapsed: false,
          items: [
            { text: '简介', link: '/guide/introduction' },
            { text: '快速上手', link: '/guide/quick-start' }
          ]
        },
        {
          text: 'AI',
          collapsed: false,
          items: [
            { text: 'LLMs.txt', link: '/guide/llms' },
            { text: 'Skills', link: '/guide/skills' }
          ]
        },
        {
          text: '基础',
          collapsed: false,
          items: [
            { text: '样式配置', link: '/guide/styles' },
            { text: '数据接入', link: '/guide/data-integration' },
            { text: '国际化', link: '/guide/i18n' },
            { text: '环境要求', link: '/guide/environment' },
            { text: '快捷键', link: '/guide/hot-key' }
          ]
        },
        {
          text: '进阶',
          collapsed: false,
          items: [
            { text: '基础图形', link: '/guide/figure' },
            { text: '技术指标', link: '/guide/indicator' },
            { text: '覆盖物', link: '/guide/overlay' },
            { text: '本地开发', link: '/guide/local-development' }
          ]
        },
        {
          text: '其它',
          collapsed: false,
          items: [
            { text: '从 9.x 到 10.x', link: '/guide/v9-to-v10' },
            { text: '常见问题', link: '/guide/faq' },
            { text: '反馈和共建', link: '/guide/feedback' },
            { text: '更新日志', link: '/guide/changelog' }
          ]
        }
      ],
      '/api/chart/': getChartApiMenus(),
      '/api/instance/': getInstanceApiMenus()
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    editLink: {
      pattern: 'https://github.com/klinecharts/KLineChart/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    outline: {
      label: '页面导航'
    },
    returnToTopLabel: '返回顶部',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})

export const search = {
  root: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        noResultsText: '无法找到相关结果',
        resetButtonTitle: '清除查询条件',
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭'
        }
      }
    }
  }
}
