```typescript
(
  xAxis: {
    name: string
    scrollZoomEnabled?: boolean
    createTicks?: (params: object) => Array<{
      coord: number
      value: number | string
      text: string
    }>
  }
) => void
```