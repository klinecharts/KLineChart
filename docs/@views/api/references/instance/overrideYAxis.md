```typescript
(
  yAxis?: {
    paneId?: string
    id?: string
    name?: string
    reverse?: boolean
    inside?: boolean
    needWidget?: boolean
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
) => void
```
