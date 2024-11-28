import { defineConfig } from 'vitepress'

import { getChartApiMenus, getInstanceApiMenus } from './share'

import pkg from '../../../package.json'

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
      { text: '预览', link: 'https://preview.klinecharts.com' },
      { text: '定制', link: '/customize' },
      { text: '赞助', link: '/sponsor' },
      {
        text: '更多',
        items: [
          {
            text: '资源',
            items: [
              { text: 'Pro', link: 'https://pro.klinecharts.com' },
              { text: '扩展(建设中)', link: 'https://klinecharts.com' }
            ]
          },
          {
            text: '开发指南',
            items: [
              { text: '本地开发', link: '/more/local-development' },
            ]
          },
          {
            text: '社区',
            items: [
              { text: '常见问题', link: '/more/faq' },
              { text: '反馈和共建', link: '/more/feedback' }
            ]
          }
        ]
      },
      {
        text: 'Next',
        items: [
          { text: 'V9 文档', link: 'https://v9.klinecharts.com' },
          { text: 'V8 文档', link: 'https://v8.klinecharts.com/zh-CN' }
        ]
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          collapsed: false,
          items: [
            { text: '简介', link: '/guide/introduction' },
            { text: '快速上手', link: '/guide/quick-start' },
          ]
        },
        {
          text: '基础篇',
          collapsed: false,
          items: [
            { text: '样式配置', link: '/guide/styles' },
            { text: '数据', link: '/guide/data-source' },
            { text: '国际化', link: '/guide/i18n' },
            { text: '环境要求', link: '/guide/environment' },
            { text: '快捷键', link: '/guide/hot-key' },
          ]
        },
        {
          text: '进阶篇',
          collapsed: false,
          items: [
            { text: '基础图形', link: '/guide/figure' },
            { text: '技术指标', link: '/guide/indicator' },
            { text: '覆盖物', link: '/guide/overlay' },
            { text: '自定义坐标轴', link: '/guide/custom-axis' }
          ]
        },
        {
          text: '其它',
          collapsed: false,
          items: [
            
            { text: '从v8到v9', link: '/guide/v8-to-v9' },
            { text: '更新日志', link: '/guide/changelog' },
            
          ]
        }
      ],
      '/api/chart/': getChartApiMenus(),
      '/api/instance/': getInstanceApiMenus(),
      '/sample/': [
        { text: '基础展示', link: '/sample/basic' },
        { text: '蜡烛图类型', link: '/sample/candle-type' },
        { text: '技术指标', link: '/sample/indicator' },
        { text: '坐标轴', link: '/sample/axis' },
        { text: '提示条', link: '/sample/tooltip' },
        { text: '覆盖物', link: '/sample/overlay' },
        { text: '数据加载', link: '/sample/data' },
        { text: '主题', link: '/sample/theme' },
        { text: '时区', link: '/sample/timezone' },
        { text: '多语言', link: '/sample/i18n' },
      ]
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
          closeText: '关闭',
        }
      }
    }
  }
}