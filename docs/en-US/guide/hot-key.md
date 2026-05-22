# ⌨️ Hot Key

Hot keys can be registered globally. Once registered, they can be used by all chart instances. The chart listens to keyboard events, but hot keys are ignored inside `input`, `textarea`, and `contenteditable` elements.

Built-in hot keys:

| Name | Key | Description |
| --- | --- | --- |
| `scrollRight` | `Shift+ArrowRight` | Move right |
| `scrollLeft` | `Shift+ArrowLeft` | Move left |
| `zoomIn` | `Shift+Equal`, `Shift+NumpadAdd` | Zoom in |
| `zoomOut` | `Shift+Minus`, `Shift+NumpadSubtract` | Zoom out |

## Custom Hot Keys

Use [registerHotkey](/en-US/api/chart/registerHotkey) to register a hot key globally, similar to custom indicators.

```javascript
import { registerHotkey } from 'klinecharts'

registerHotkey({
  name: 'scrollToRealTime',
  keys: 'R',
  action: ({ chart }) => {
    chart.scrollToRealTime()
  }
})
```

`keys` can be a string or a string array.

```javascript
registerHotkey({
  name: 'customZoomIn',
  keys: ['Shift+=', 'Shift+NumpadAdd'],
  action: ({ chart }) => {
    chart.zoomAtCoordinate(1.2)
  }
})
```

The hot key template supports these fields:

```typescript
interface HotkeyTemplate {
  name: string
  keys: string | string[]
  preventDefault?: boolean
  stopPropagation?: boolean
  check?: (params) => boolean
  action: (params) => void
  extendData?: unknown
}
```

When `check` returns `false`, `action` will not run. `event.preventDefault()` is called by default, and can be disabled with `preventDefault: false`.

Key strings are composed of modifiers and a key, such as `Shift+ArrowLeft`, `Ctrl+S`, `Meta+Z`, and `Mod+Z`. `Mod` means `Meta` on macOS and iOS, and `Ctrl` on other systems. Common aliases include `Command`/`Cmd`, `Control`, `Option`, `Plus`, `Minus`, `Esc`, `Del`, `Left`, `Right`, `Up`, and `Down`.

## Instance Control

Each chart instance can control whether hot keys are enabled, and which global hot keys are excluded.

```javascript
const chart = init('chart', {
  hotkey: {
    enabled: true,
    exclude: ['zoomIn']
  }
})
```

You can also update the instance after it is created with [setHotkey](/en-US/api/instance/setHotkey), and get the current instance hot key configuration with [getHotkey](/en-US/api/instance/getHotkey).

```javascript
chart.setHotkey({
  enabled: false
})

chart.setHotkey({
  enabled: true,
  exclude: ['zoomIn']
})

const hotkey = chart.getHotkey()
```

Use [getSupportedHotkeys](/en-US/api/chart/getSupportedHotkeys) to get registered hot key names, and [getHotkey](/en-US/api/chart/getHotkey) to get a hot key template.

```javascript
import { getSupportedHotkeys, getHotkey } from 'klinecharts'

const names = getSupportedHotkeys()
const zoomIn = getHotkey('zoomIn')
```
