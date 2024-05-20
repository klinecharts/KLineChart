import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'

import zhCN, { search as zhCNSearch } from './zh-CN'
import enUS, { search as enUSSearch } from './en-US'

export default defineConfig({
  vite: {
    server: {
      port: 8888
    },
    define: {
      'process.env': JSON.stringify(process.env)
    }
  },
  cleanUrls: true,
  metaChunk: true,
  title: 'KLineChart',
  outDir: '../website',
  srcExclude: ['components', 'data'],
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerTwoslash(),
    ],
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' }],
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
  ],
  locales: {
    root: zhCN,
    'en-US': enUS,
  },
  themeConfig: {
    logo: '/images/logo.svg',
    search: {
      provider: 'local',
      options: {
        locales: { ...zhCNSearch, ...enUSSearch }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/klinecharts/KLineChart' },
      { icon: { svg: `<svg viewBox="0 0 1024 1024"><path d="M679.424 746.862l84.005-395.996c7.424-34.852-12.581-48.567-35.438-40.009L234.277 501.138c-33.72 13.13-33.134 32-5.706 40.558l126.282 39.424 293.156-184.576c13.714-9.143 26.295-3.986 16.018 5.157L426.898 615.973l-9.143 130.304c13.13 0 18.871-5.706 25.71-12.581l61.696-59.429 128 94.282c23.442 13.129 40.01 6.29 46.3-21.724zM1024 512c0 282.843-229.157 512-512 512S0 794.843 0 512 229.157 0 512 0s512 229.157 512 512z"/></svg>` }, link: 'https://t.me/klinecharts' },
      { icon: 'discord', link: 'https://discord.gg/7YjHYgvvvZ' },
      { icon: { svg: '<svg viewBox="0 0 1193 1024"><path d="M806.287212 309.998684c13.642769 0 27.127442 1.050875 40.528417 2.631837C810.407012 133.842355 629.080008 1.032275 422.076327 1.032275 190.688636 1.032275 1.112733 167.275045 1.112733 378.379926c0 121.864245 63.061771 221.92052 168.465415 299.536438l-42.100079 133.470365 147.122433-77.783315c52.692523 10.992333 94.922799 22.27296 147.475825 22.27296 13.20568 0 26.309062-0.678884 39.310147-1.757657-8.2396-29.666281-13.001085-60.727528-13.001085-92.960546 0-193.8538 157.910172-351.159486 357.901823-351.159487z m-226.356512-120.301883c31.684332 0 52.683223 21.975367 52.683222 55.370858 0 33.255994-20.998891 55.519654-52.692522 55.519654-31.544835 0-63.191968-22.27296-63.191968-55.519654 0-33.39549 31.647133-55.370858 63.191968-55.370858zM285.323142 300.596612c-31.554135 0-63.405863-22.27296-63.405863-55.528953 0-33.39549 31.851728-55.370858 63.405863-55.370858 31.544835 0 52.543726 21.975367 52.543726 55.370858 0 33.255994-20.998891 55.519654-52.543726 55.519654z" p-id="3781"></path><path d="M1190.460898 655.8201c0-177.393199-168.400317-321.986094-357.557732-321.986094-200.289244 0-358.04132 144.592894-358.041319 321.986094 0 177.700092 157.752075 321.976794 358.041319 321.976794 41.923384 0 84.237358-11.159729 126.328138-22.27296l115.447401 66.651484-31.656433-110.881212c84.507051-66.80958 147.438625-155.417832 147.438626-255.474106z m-473.618918-55.519654c-20.961692 0-42.127979-21.966067-42.127978-44.387824 0-22.114864 21.166287-44.369224 42.127978-44.369224 31.823828 0 52.683223 22.25436 52.683223 44.369224 0 22.412457-20.859394 44.387824-52.683223 44.387824z m231.536487 0c-20.831495 0-41.830386-21.966067-41.830386-44.387824 0-22.114864 20.998891-44.369224 41.830386-44.369224 31.544835 0 52.683223 22.25436 52.683223 44.369224 0 22.412457-21.138388 44.387824-52.683223 44.387824z"/></svg>' }, link: '/more/feedback' },
      // { icon: 'twitter', link: 'https://twitter.com/klinecharts' }
    ],
    footer: {
      message: 'Released under the <a href="https://github.com/klinecharts/KLineChart/blob/main/LICENSE">Apache License V2</a>.',
      copyright: `Copyright © 2018-${new Date().getFullYear()} <a href="https://github.com/liihuu">liihuu</a>`
    }
  }
})
