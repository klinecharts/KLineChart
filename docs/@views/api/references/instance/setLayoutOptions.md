```typescript
(
  layout: {
    barSpaceLimit?: {
      min?: number
      max?: number
    }
    pane?: {
      height?: number
      minHeight?: number
      dragEnabled?: boolean
      order?: number
      state?: 'normal' | 'maximize' | 'minimize'
    }
    yAxis?: {
      reverse?: boolean
      inside?: boolean
      needWidget?: boolean
      position?: 'left' | 'right'
      scrollZoomEnabled?: boolean
      gap?: {
        top?: number
        bottom?: number
      }
    }
  }
) => void
```
