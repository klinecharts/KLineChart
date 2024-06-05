```jsx:line-numbers [<svg width="16px" height="16px" viewBox="256 239 256 239"><defs><linearGradient id="logosSolidjsIcon0" x1="27.5" x2="152" y1="3" y2="63.5" gradientTransform="translate(249.56 233.12)scale(1.61006)" gradientUnits="userSpaceOnUse"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf2fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><linearGradient id="logosSolidjsIcon1" x1="95.8" x2="74" y1="32.6" y2="105.2" gradientTransform="translate(249.56 233.12)scale(1.61006)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><linearGradient id="logosSolidjsIcon2" x1="18.4" x2="144.3" y1="64.2" y2="149.8" gradientTransform="translate(249.56 233.12)scale(1.61006)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#315aa9"/><stop offset=".5" stop-color="#518ac8"/><stop offset="1" stop-color="#315aa9"/></linearGradient><linearGradient id="logosSolidjsIcon3" x1="75.2" x2="24.4" y1="74.5" y2="260.8" gradientTransform="translate(249.56 233.12)scale(1.61006)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4377bb"/><stop offset=".5" stop-color="#1a336b"/><stop offset="1" stop-color="#1a336b"/></linearGradient></defs><path fill="#76b3e1" d="M512 289.472s-85.333-62.791-151.347-48.301l-4.829 1.61c-9.66 3.221-17.711 8.05-22.542 14.491l-3.219 4.829l-24.152 41.862l41.863 8.051c17.71 11.27 40.251 16.101 61.182 11.27l74.063 14.491z"/><path fill="url(#logosSolidjsIcon0)" d="M512 289.472s-85.333-62.791-151.347-48.301l-4.829 1.61c-9.66 3.221-17.711 8.05-22.542 14.491l-3.219 4.829l-24.152 41.862l41.863 8.051c17.71 11.27 40.251 16.101 61.182 11.27l74.063 14.491z" opacity="0.3"/><path fill="#518ac8" d="m333.282 289.472l-6.439 1.611c-27.371 8.05-35.421 33.811-20.932 56.352c16.101 20.931 49.913 32.201 77.284 24.151l99.824-33.811s-85.334-62.792-149.737-48.303"/><path fill="url(#logosSolidjsIcon1)" d="m333.282 289.472l-6.439 1.611c-27.371 8.05-35.421 33.811-20.932 56.352c16.101 20.931 49.913 32.201 77.284 24.151l99.824-33.811s-85.334-62.792-149.737-48.303" opacity="0.3"/><path fill="url(#logosSolidjsIcon2)" d="M465.308 361.925c-18.439-23.036-49.008-32.588-77.283-24.15l-99.823 32.201L256 426.328l180.327 30.592l32.201-57.963c6.441-11.271 4.831-24.15-3.22-37.032"/><path fill="url(#logosSolidjsIcon3)" d="M433.106 418.277c-18.439-23.036-49.006-32.588-77.282-24.15L256 426.328s85.333 64.402 151.346 48.303l4.83-1.612c27.371-8.049 37.031-33.81 20.93-54.742"/></svg>Solid]
import { onMount, onCleanup } from 'solid-js'
import { init, dispose } from 'klinecharts'

export default () => {
  onMount(() => {
    const chart = init('chart')

    chart.applyNewData([
      { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
      { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
      { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
      { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
      { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
      { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
      { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
      { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
      { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
      { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
    ])
  })

  onCleanup(() => {
    // 销毁图表
    dispose('chart')
  })

  return <div id="chart" style={{ width: '600px', height: '600px' }}/>
}

```