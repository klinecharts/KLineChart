```typescript
(hotkey: {
  name: string
  keys: string | string[]
  preventDefault?: boolean
  stopPropagation?: boolean
  check?: (params: {
    chart: Chart
    event: KeyboardEvent
    key: string
    hotkey: HotkeyTemplate
  }) => boolean
  action: (params: {
    chart: Chart
    event: KeyboardEvent
    key: string
    hotkey: HotkeyTemplate
  }) => void
  extendData?: any
}) => void
```
