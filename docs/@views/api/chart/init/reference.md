```typescript
(
  ds: string | HTMLElement,
  options?: {
    layout?: Array<{
      type: 'candle' | 'indicator' | 'xAxis'
      content: Array<Indicator | string>
      options: {
        id?: string
        height?: number
        minHeight?: number
        dragEnabled?: boolean
        position?: 'top' | 'bottom'
        gap?: {
          top?: number
          bottom?: number
        }
        axisOptions?: {
          name?: string
          scrollZoomEnabled?: boolean
        }
      }
    }>
    locale?: string
    styles?: string | object
    timezone?: string
    customApi?: {
      formatDate?: (timestamp: number, format: string, type: number) => string
      formatBigNumber?: (value: string | number) => string
    }
    thousandsSeparator?: string
    decimalFoldThreshold?: number
  }
) => Chart
```