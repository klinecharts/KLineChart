```typescript
(
  dataLoader: {
    getBars: (params: object) => void | Promise<void>
    subscribeBar?: (params: object) => void
    unsubscribeBar?: (params: object) => void
  }
) => void
```