```typescript
(
  value: {
    dataIndex?: number
    timestamp?: number
    value?: number
  } | Array<{
    dataIndex?: number
    timestamp?: number
    value?: number
  }>,
  finder?: {
    paneId?: string
    absolute?: boolean
  }
) => { x: number?, y?: number } | Array<{ x?: number, y?: number }>
```