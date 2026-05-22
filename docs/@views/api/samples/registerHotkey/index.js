import { registerHotkey } from 'klinecharts'

registerHotkey({
  name: 'scrollToRealTime',
  keys: 'R',
  action: ({ chart }) => {
    chart.scrollToRealTime()
  }
})
