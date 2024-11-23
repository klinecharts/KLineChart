```typescript
(
  xAxis: {
    name: string
    scrollZoomEnabled?: boolean
    createTicks?: (params: AxisCreateTicksParams) => Array<{
      coord: number
      value: number | string
      text: string
    }>
  }
) => void
```