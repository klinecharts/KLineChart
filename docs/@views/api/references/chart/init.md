```typescript
(
  ds: string | HTMLElement,
  options?: {
    layout?: {
      basicParams?: {
        barSpaceLimitMin?: number
        barSpaceLimitMax?: number
        yAxisPosition?: 'left' | 'right'
        yAxisInside?: boolean
        paneMinHeight?: number
        paneHeight?: number
      }
      panes?: Array<{
        type: 'candle' | 'indicator' | 'xAxis'
        content?: Array<string | IndicatorCreate | {
          indicator: string | IndicatorCreate
          yAxis?: Omit<AxisOverride, 'paneId'>
        }>
        options?: {
          id?: string
          height?: number
          minHeight?: number
          dragEnabled?: boolean
          order?: number
          state?: 'normal' | 'maximize' | 'minimize'
        }
      }>
    }
    locale?: string
    styles?: string | DeepPartial<Styles>
    timezone?: string
    formatter?: {
      formatDate?: (params: {
        dateTimeFormat: Intl.DateTimeFormat
        timestamp: number
        template: string
        type: 'tooltip' | 'crosshair' | 'xAxis'
      }) => string
      formatBigNumber?: (value: string | number) => string
      formatExtendText?: (params: {
        type: 'last_price'
        data: KLineData
        index: number
      }) => string
    }
    thousandsSeparator?: {
      sign?: string
      format: (value: number | string) => string
    }
    decimalFold?: {
      threshold?: number
      format?: (value: number | string) => string
    }
    zoomAnchor?: 'cursor' | 'last_bar' | { main?: 'cursor' | 'last_bar', xAxis?: 'cursor' | 'last_bar' }
  }
) => Chart
```
