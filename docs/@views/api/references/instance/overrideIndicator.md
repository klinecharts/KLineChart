```typescript
(
  indicator: {
    id?: string
    paneId?: string
    name?: string
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
    onClick?: (params: object) => void
    onDataStateChange?: (params: object) => void
  }
) => void
```