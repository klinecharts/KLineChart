```typescript
(
  customApi: {
    formatDate?: (params: {
      dateTimeFormat: Intl.DateTimeFormat
      timestamp: number
      template: string
      type: 'tooltip' | 'crosshair' | 'xAxis'
    }) => string
    formatBigNumber?: (value: string | number) => string
  }
) => void
```