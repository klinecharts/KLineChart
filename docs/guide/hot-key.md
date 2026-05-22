# ⌨️ 快捷键

快捷键支持全局注册，注册后所有图表实例都可以使用。图表会监听键盘事件，但在 `input`、`textarea`、`contenteditable` 元素中不会触发快捷键。

内置快捷键如下：

| 名称 | 按键 | 说明 |
| --- | --- | --- |
| `scrollRight` | `Shift+ArrowRight` | 右移 |
| `scrollLeft` | `Shift+ArrowLeft` | 左移 |
| `zoomIn` | `Shift+Equal`、`Shift+NumpadAdd` | 放大 |
| `zoomOut` | `Shift+Minus`、`Shift+NumpadSubtract` | 缩小 |

## 自定义快捷键

通过 [registerHotkey](/api/chart/registerHotkey) 可以像自定义指标一样全局注册快捷键。

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

`keys` 可以是字符串，也可以是字符串数组。

```javascript
registerHotkey({
  name: 'customZoomIn',
  keys: ['Shift+=', 'Shift+NumpadAdd'],
  action: ({ chart }) => {
    chart.zoomAtCoordinate(1.2)
  }
})
```

快捷键配置支持以下字段：

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

`check` 返回 `false` 时不会执行 `action`。默认会调用 `event.preventDefault()`，可以通过 `preventDefault: false` 关闭。

按键字符串由修饰键和按键组成，例如 `Shift+ArrowLeft`、`Ctrl+S`、`Meta+Z`、`Mod+Z`。其中 `Mod` 在 macOS、iOS 上表示 `Meta`，其他系统表示 `Ctrl`。常用别名包括 `Command`/`Cmd`、`Control`、`Option`、`Plus`、`Minus`、`Esc`、`Del`、`Left`、`Right`、`Up`、`Down`。

## 实例控制

图表实例可以通过初始化参数控制是否启用快捷键，以及排除哪些全局快捷键。

```javascript
const chart = init('chart', {
  hotkey: {
    enabled: true,
    exclude: ['zoomIn']
  }
})
```

也可以在实例创建后通过 [setHotkey](/api/instance/setHotkey) 更新，并通过 [getHotkey](/api/instance/getHotkey) 获取当前实例的快捷键配置。

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

可以通过 [getSupportedHotkeys](/api/chart/getSupportedHotkeys) 获取当前已注册的快捷键名称，通过 [getHotkey](/api/chart/getHotkey) 获取某个快捷键配置。

```javascript
import { getSupportedHotkeys, getHotkey } from 'klinecharts'

const names = getSupportedHotkeys()
const zoomIn = getHotkey('zoomIn')
```
