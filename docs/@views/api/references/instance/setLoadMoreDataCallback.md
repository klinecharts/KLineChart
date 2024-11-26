```typescript
(
  cb: (params: { 
    type: 'forward' | 'backward'
    data: Nullable<KLineData>
    callback: (dataList: KLineData[], more?: boolean) => void
  }) => void
) => void
```