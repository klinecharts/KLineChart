```typescript
(
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
    }
  }
) => void
```