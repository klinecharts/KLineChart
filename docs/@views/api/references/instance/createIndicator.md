```typescript
(
  indicator: string | {
    name: string
    shortName?: string
    precision?: number
    calcParams?: unknown[]
    shouldOhlc?: boolean
    shouldFormatBigNumber?: boolean
    visible?: boolean
    zLevel?: number
    extendData?: unknown
    series?: 'normal' | 'price' | 'volume',
    figures?: Array<{
      key: string
      title?: string
      type?: string
      baseValue?: number
      attrs?: (params: object) => object
      styles?: (params: object) => object
    }>
    minValue?: number
    maxValue?: number
    styles?: Partial<IndicatorStyle>
    shouldUpdate?: (prev: Indicator, current: Indicator) => (boolean | { calc: boolean, draw: boolean })
    calc?: (kLineDataList: KLineData[], indicator: Indicator) => unknown[] | Promise<unknown[]>
    regenerateFigures?: (calcParams: unknown[]) => Array<{
      key: string
      title?: string
      type?: string
      baseValue?: number
      attrs?: (params: object) => object
      styles?: (params: object) => object
    }>
    createTooltipDataSource?: (params: object) => ({
      name?: string
      calcParamsText?: string
      icons?: Array<{
        id?: string
        position?: 'left' | 'middle' | 'right'
        color?: string
        activeColor?: string
        size?: number
        fontFamily?: string
        icon?: string
        backgroundColor?: string
        activeBackgroundColor?: string
      }>
      legends?: Array<{
        title: string |
          {
            text: string
            color: string
          }
        value: string |
          {
            text: string
            color: string
          }
      }>
    })
    draw?: (params: object) => boolean
    onDataStateChange?: (params: object) => void
  },
  isStack?: boolean
  paneOptions: {
    id?: string
    height?: number
    minHeight?: number
    dragEnabled?: boolean
    order?: number
    state?: 'normal' | 'maximize' | 'minimize'
    axis?: {
      name: string
      reverse?: boolean
      inside?: boolean
      position?: 'left' | 'right'
      scrollZoomEnabled?: boolean
      gap?: {
        top?: number
        bottom?: number
      }
    }
  }
) => string | null
```