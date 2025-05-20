```jsx:line-numbers [<svg width="16px" height="16px" viewBox="256 239 256 239"><defs><linearGradient id="logosSolidjsIcon0" x1="27.5" x2="152" y1="3" y2="63.5" gradientTransform="translate(249.56 233.12)scale(1.61006)" gradientUnits="userSpaceOnUse"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf2fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><linearGradient id="logosSolidjsIcon1" x1="95.8" x2="74" y1="32.6" y2="105.2" gradientTransform="translate(249.56 233.12)scale(1.61006)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><linearGradient id="logosSolidjsIcon2" x1="18.4" x2="144.3" y1="64.2" y2="149.8" gradientTransform="translate(249.56 233.12)scale(1.61006)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#315aa9"/><stop offset=".5" stop-color="#518ac8"/><stop offset="1" stop-color="#315aa9"/></linearGradient><linearGradient id="logosSolidjsIcon3" x1="75.2" x2="24.4" y1="74.5" y2="260.8" gradientTransform="translate(249.56 233.12)scale(1.61006)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4377bb"/><stop offset=".5" stop-color="#1a336b"/><stop offset="1" stop-color="#1a336b"/></linearGradient></defs><path fill="#76b3e1" d="M512 289.472s-85.333-62.791-151.347-48.301l-4.829 1.61c-9.66 3.221-17.711 8.05-22.542 14.491l-3.219 4.829l-24.152 41.862l41.863 8.051c17.71 11.27 40.251 16.101 61.182 11.27l74.063 14.491z"/><path fill="url(#logosSolidjsIcon0)" d="M512 289.472s-85.333-62.791-151.347-48.301l-4.829 1.61c-9.66 3.221-17.711 8.05-22.542 14.491l-3.219 4.829l-24.152 41.862l41.863 8.051c17.71 11.27 40.251 16.101 61.182 11.27l74.063 14.491z" opacity="0.3"/><path fill="#518ac8" d="m333.282 289.472l-6.439 1.611c-27.371 8.05-35.421 33.811-20.932 56.352c16.101 20.931 49.913 32.201 77.284 24.151l99.824-33.811s-85.334-62.792-149.737-48.303"/><path fill="url(#logosSolidjsIcon1)" d="m333.282 289.472l-6.439 1.611c-27.371 8.05-35.421 33.811-20.932 56.352c16.101 20.931 49.913 32.201 77.284 24.151l99.824-33.811s-85.334-62.792-149.737-48.303" opacity="0.3"/><path fill="url(#logosSolidjsIcon2)" d="M465.308 361.925c-18.439-23.036-49.008-32.588-77.283-24.15l-99.823 32.201L256 426.328l180.327 30.592l32.201-57.963c6.441-11.271 4.831-24.15-3.22-37.032"/><path fill="url(#logosSolidjsIcon3)" d="M433.106 418.277c-18.439-23.036-49.006-32.588-77.282-24.15L256 426.328s85.333 64.402 151.346 48.303l4.83-1.612c27.371-8.049 37.031-33.81 20.93-54.742"/></svg>Solid]
import { onMount, onCleanup } from 'solid-js'
import { init, dispose } from 'klinecharts'

export default () => {
  onMount(() => {
    const chart = init('chart')
    chart.setSymbol({ ticker: 'TestSymbol' })
    chart.setPeriod({ span: 1, type: 'day' })
    chart.setDataLoader({
      getBars: ({ callback}) => {
        callback([
          { timestamp: 1517846400000, open: 7424.6, high: 7511.3, low: 6032.3, close: 7310.1, volume: 224461 },
          { timestamp: 1517932800000, open: 7310.1, high: 8499.9, low: 6810, close: 8165.4, volume: 148807 },
          { timestamp: 1518019200000, open: 8166.7, high: 8700.8, low: 7400, close: 8245.1, volume: 24467 },
          { timestamp: 1518105600000, open: 8244, high: 8494, low: 7760, close: 8364, volume: 29834 },
          { timestamp: 1518192000000, open: 8363.6, high: 9036.7, low: 8269.8, close: 8311.9, volume: 28203 },
          { timestamp: 1518278400000, open: 8301, high: 8569.4, low: 7820.2, close: 8426, volume: 59854 },
          { timestamp: 1518364800000, open: 8426, high: 8838, low: 8024, close: 8640, volume: 54457 },
          { timestamp: 1518451200000, open: 8640, high: 8976.8, low: 8360, close: 8500, volume: 51156 },
          { timestamp: 1518537600000, open: 8504.9, high: 9307.3, low: 8474.3, close: 9307.3, volume: 49118 },
          { timestamp: 1518624000000, open: 9307.3, high: 9897, low: 9182.2, close: 9774, volume: 48092 }
        ])
      }
    })
  })

  onCleanup(() => {
    // 销毁图表
    dispose('chart')
  })

  return <div id="chart" style={{ width: '600px', height: '600px' }}/>
}

```