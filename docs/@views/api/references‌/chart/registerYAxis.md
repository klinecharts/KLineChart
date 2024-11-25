```typescript
(
  xAxis: {
    name: string
    reverse?: boolean
    inside?: boolean
    position?: 'left' | 'right'
    scrollZoomEnabled?: boolean
    gap?: {
      top?: number
      bottom?: number
    }
    valueToRealValue?: (value: number, params: object) => number
    realValueToDisplayValue?: (value: number, params: object) => number
    displayValueToRealValue?: (value: number, params: object) => number
    realValueToValue?: (value: number, params: object) => number
    displayValueToText?: (value: number, precision: number) => string
    minSpan?: (precision: number) => number
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
) => void
```