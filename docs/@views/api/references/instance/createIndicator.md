```typescript
(
  indicator: string | {
    name: string
    id?: string
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
      features?: Array<{
        id?: string
        position?: 'left' | 'middle' | 'right'
        marginLeft?: number
        marginTop?: number
        marginRight?: number
        marginBottom?: number
        paddingLeft?: number
        paddingTop?: number
        paddingRight?: number
        paddingBottom?: number
        size?: number
        color?: string
        activeColor?: string
        backgroundColor?: string
        activeBackgroundColor?: string
        type?: 'path' | 'icon_font'
        path?: {
          style?: 'stroke' | 'fill'
          path?: string
          lineWidth?: number
        }
        iconFont?: {
          content?: string
          family?: string
        }
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
  isStack?: boolean,
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
      createRange?: (params: object) => ({
        from: number
        to: number
        range: number
        realFrom: number
        realTo: number
        realRange: number
        displayFrom: number
        displayTo: number
        displayRange: number
      })
      createTicks?: (params: object) => Array<{
        coord: number
        value: number | string
        text: string
      }>
    }
  }
) => string | null
```