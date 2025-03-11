```typescript
(
  ds: string | HTMLElement,
  options?: {
    layout?: Array<{
      type: 'candle' | 'indicator' | 'xAxis'
      content?: Array<Indicator | string>
      options?: {
        id?: string
        height?: number
        minHeight?: number
        dragEnabled?: boolean
        order?: number
        state?: 'normal' | 'maximize' | 'minimize'
        axis?: {
          name?: string
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
    }>
    locale?: string
    styles?: string | Styles
    timezone?: string
    customApi?: {
      formatDate?: (params: {
        dateTimeFormat: Intl.DateTimeFormat
        timestamp: number
        template: string
        type: 'tooltip' | 'crosshair' | 'xAxis'
      }) => string
      formatBigNumber?: (value: string | number) => string
    }
    thousandsSeparator?: {
      sign?: string
      format: (value: number | string) => string
    }
    decimalFold?: {
      threshold?: number
      format?: (value: number | string) => string
    }
  }
) => Chart
```