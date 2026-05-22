import type { Chart } from '../Chart'

export interface HotkeyActionParams<E = unknown> {
  chart: Chart
  event: KeyboardEvent
  key: string
  hotkey: HotkeyTemplate<E>
}

export interface HotkeyTemplate<E = unknown> {
  name: string
  keys: string | string[]
  preventDefault?: boolean
  stopPropagation?: boolean
  check?: (params: HotkeyActionParams<E>) => boolean
  action: (params: HotkeyActionParams<E>) => void
  extendData?: E
}
