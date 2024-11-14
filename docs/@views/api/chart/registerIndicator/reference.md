```typescript
(
  indicator: {
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
      attrs?: (
        params: {
          
        }
      ) => IndicatorFigureAttrs
      styles?: IndicatorFigureStylesCallback
    }>
    minValue?: number
    maxValue?: number
    styles?: Partial<IndicatorStyle>
    shouldUpdate?: IndicatorShouldUpdateCallback
    calc: IndicatorCalcCallback
    regenerateFigures?: IndicatorRegenerateFiguresCallback
    createTooltipDataSource?: IndicatorCreateTooltipDataSourceCallback
    draw?: IndicatorDrawCallback
    onDataStateChange?: IndicatorOnDataStateChangeCallback
  }
) => void
```