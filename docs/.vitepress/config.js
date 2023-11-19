import path from 'path'
import fs from 'fs'

import { defineConfig } from 'vitepress'

import pkg from '../../package.json'

const pwd = process.cwd()
const projectPwd = pwd.split(path.sep)
projectPwd.splice(projectPwd.length - 1, 1)
const plugPath = projectPwd.join(path.sep) + path.sep + 'dist' + path.sep + 'klinecharts.min.js'

const plugCode = fs.readFileSync(plugPath, 'utf-8')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    server: {
      port: 8888
    },
    define: {
      'process.env': JSON.stringify(process.env)
    }
  },
  lang: 'zh-CN',
  title: 'KLineChart',
  description: '💹📈 可高度自定义的专业级轻量金融图表。',
  outDir: '../website',
  srcExclude: ['components', 'data'],
  lastUpdated: true,
  markdown: {
    theme: {
      dark: 'material-theme-palenight',
      light: 'github-light'
    }  
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' }],
  ],
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
  transformPageData: (pageData) => {
    if (pageData.filePath.startsWith('sample/') || pageData.filePath.startsWith('en-US/sample/')) {
      pageData.frontmatter.head ??= []
      pageData.frontmatter.head.push(['script', {}, plugCode])
    }
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/what-is-klinechart', activeMatch: 'guide' },
          { text: '示例', link: '/sample/basic', activeMatch: 'sample' },
          { text: 'Pro', link: 'https://pro.klinecharts.com' },
          { text: '预览', link: 'https://preview.klinecharts.com' },
          { text: '赞助', link: '/sponsor' },
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
              ]
            },
            {
              text: '基础篇',
              collapsed: false,
              items: [
                { text: '快速开始', link: '/guide/getting-started' },
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
        socialLinks: [
          { icon: 'github', link: 'https://github.com/liihuu/KLineChart' },
          { icon: { svg: `<svg viewBox="0 0 1024 1024"><path d="M679.424 746.862l84.005-395.996c7.424-34.852-12.581-48.567-35.438-40.009L234.277 501.138c-33.72 13.13-33.134 32-5.706 40.558l126.282 39.424 293.156-184.576c13.714-9.143 26.295-3.986 16.018 5.157L426.898 615.973l-9.143 130.304c13.13 0 18.871-5.706 25.71-12.581l61.696-59.429 128 94.282c23.442 13.129 40.01 6.29 46.3-21.724zM1024 512c0 282.843-229.157 512-512 512S0 794.843 0 512 229.157 0 512 0s512 229.157 512 512z"/></svg>` }, link: 'https://t.me/+098syuQtzI0yNzll' },
          { icon: 'discord', link: 'https://discord.gg/7YjHYgvvvZ' },
          { icon: { svg: '<svg viewBox="0 0 1193 1024"><path d="M806.287212 309.998684c13.642769 0 27.127442 1.050875 40.528417 2.631837C810.407012 133.842355 629.080008 1.032275 422.076327 1.032275 190.688636 1.032275 1.112733 167.275045 1.112733 378.379926c0 121.864245 63.061771 221.92052 168.465415 299.536438l-42.100079 133.470365 147.122433-77.783315c52.692523 10.992333 94.922799 22.27296 147.475825 22.27296 13.20568 0 26.309062-0.678884 39.310147-1.757657-8.2396-29.666281-13.001085-60.727528-13.001085-92.960546 0-193.8538 157.910172-351.159486 357.901823-351.159487z m-226.356512-120.301883c31.684332 0 52.683223 21.975367 52.683222 55.370858 0 33.255994-20.998891 55.519654-52.692522 55.519654-31.544835 0-63.191968-22.27296-63.191968-55.519654 0-33.39549 31.647133-55.370858 63.191968-55.370858zM285.323142 300.596612c-31.554135 0-63.405863-22.27296-63.405863-55.528953 0-33.39549 31.851728-55.370858 63.405863-55.370858 31.544835 0 52.543726 21.975367 52.543726 55.370858 0 33.255994-20.998891 55.519654-52.543726 55.519654z" p-id="3781"></path><path d="M1190.460898 655.8201c0-177.393199-168.400317-321.986094-357.557732-321.986094-200.289244 0-358.04132 144.592894-358.041319 321.986094 0 177.700092 157.752075 321.976794 358.041319 321.976794 41.923384 0 84.237358-11.159729 126.328138-22.27296l115.447401 66.651484-31.656433-110.881212c84.507051-66.80958 147.438625-155.417832 147.438626-255.474106z m-473.618918-55.519654c-20.961692 0-42.127979-21.966067-42.127978-44.387824 0-22.114864 21.166287-44.369224 42.127978-44.369224 31.823828 0 52.683223 22.25436 52.683223 44.369224 0 22.412457-20.859394 44.387824-52.683223 44.387824z m231.536487 0c-20.831495 0-41.830386-21.966067-41.830386-44.387824 0-22.114864 20.998891-44.369224 41.830386-44.369224 31.544835 0 52.683223 22.25436 52.683223 44.369224 0 22.412457-21.138388 44.387824-52.683223 44.387824z"/></svg>' }, link: '/guide/feedback' },
          // { icon: 'twitter', link: 'https://twitter.com/klinecharts' }
        ],
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
        outlineTitle: '本页目录',
        returnToTopLabel: '返回顶部',
      }
    },
    'en-US': {
      label: 'English',
      lang: 'en-US',
      link: '/en-US/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en-US/guide/what-is-klinechart', activeMatch: 'guide' },
          { text: 'Sample', link: '/en-US/sample/basic', activeMatch: 'sample' },
          { text: 'Pro', link: 'https://pro.klinecharts.com/en-US' },
          { text: 'Preview', link: 'https://preview.klinecharts.com/#en-US' },
          { text: 'Sponsor', link: '/en-US/sponsor' },
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
              ]
            },
            {
              text: 'Basic',
              collapsed: false,
              items: [
                { text: 'Getting Started', link: '/en-US/guide/getting-started' },
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
        socialLinks: [
          { icon: 'github', link: 'https://github.com/liihuu/KLineChart' },
          { icon: { svg: `<svg viewBox="0 0 1024 1024"><path d="M679.424 746.862l84.005-395.996c7.424-34.852-12.581-48.567-35.438-40.009L234.277 501.138c-33.72 13.13-33.134 32-5.706 40.558l126.282 39.424 293.156-184.576c13.714-9.143 26.295-3.986 16.018 5.157L426.898 615.973l-9.143 130.304c13.13 0 18.871-5.706 25.71-12.581l61.696-59.429 128 94.282c23.442 13.129 40.01 6.29 46.3-21.724zM1024 512c0 282.843-229.157 512-512 512S0 794.843 0 512 229.157 0 512 0s512 229.157 512 512z"/></svg>` }, link: 'https://t.me/+098syuQtzI0yNzll' },
          { icon: 'discord', link: 'https://discord.gg/7YjHYgvvvZ' },
          { icon: { svg: '<svg viewBox="0 0 1193 1024"><path d="M806.287212 309.998684c13.642769 0 27.127442 1.050875 40.528417 2.631837C810.407012 133.842355 629.080008 1.032275 422.076327 1.032275 190.688636 1.032275 1.112733 167.275045 1.112733 378.379926c0 121.864245 63.061771 221.92052 168.465415 299.536438l-42.100079 133.470365 147.122433-77.783315c52.692523 10.992333 94.922799 22.27296 147.475825 22.27296 13.20568 0 26.309062-0.678884 39.310147-1.757657-8.2396-29.666281-13.001085-60.727528-13.001085-92.960546 0-193.8538 157.910172-351.159486 357.901823-351.159487z m-226.356512-120.301883c31.684332 0 52.683223 21.975367 52.683222 55.370858 0 33.255994-20.998891 55.519654-52.692522 55.519654-31.544835 0-63.191968-22.27296-63.191968-55.519654 0-33.39549 31.647133-55.370858 63.191968-55.370858zM285.323142 300.596612c-31.554135 0-63.405863-22.27296-63.405863-55.528953 0-33.39549 31.851728-55.370858 63.405863-55.370858 31.544835 0 52.543726 21.975367 52.543726 55.370858 0 33.255994-20.998891 55.519654-52.543726 55.519654z" p-id="3781"></path><path d="M1190.460898 655.8201c0-177.393199-168.400317-321.986094-357.557732-321.986094-200.289244 0-358.04132 144.592894-358.041319 321.986094 0 177.700092 157.752075 321.976794 358.041319 321.976794 41.923384 0 84.237358-11.159729 126.328138-22.27296l115.447401 66.651484-31.656433-110.881212c84.507051-66.80958 147.438625-155.417832 147.438626-255.474106z m-473.618918-55.519654c-20.961692 0-42.127979-21.966067-42.127978-44.387824 0-22.114864 21.166287-44.369224 42.127978-44.369224 31.823828 0 52.683223 22.25436 52.683223 44.369224 0 22.412457-20.859394 44.387824-52.683223 44.387824z m231.536487 0c-20.831495 0-41.830386-21.966067-41.830386-44.387824 0-22.114864 20.998891-44.369224 41.830386-44.369224 31.544835 0 52.683223 22.25436 52.683223 44.369224 0 22.412457-21.138388 44.387824-52.683223 44.387824z"/></svg>' }, link: '/en-US/guide/feedback' },
          // { icon: 'twitter', link: 'https://twitter.com/klinecharts' }
        ],
        editLink: {
          pattern: 'https://github.com/liihuu/KLineChart/edit/main/docs/:path'
        }
      }
    },
  },
  themeConfig: {
    logo: '/images/logo.svg',
    search: {
      provider: 'local',
      options: {
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
              navigateText: '切换'
            }
          }
        },
        locales: {
          'en-US': {
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
                  navigateText: 'to navigate'
                }
              }
            }
          }
        }
      }
    },
    footer: {
      message: 'Released under the Apache License V2.',
      copyright: 'Copyright © 2018-present liihuu'
    }
  }
})
