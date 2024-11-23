```typescript
(
  overlay: {
    name: string
    draw: (ctx: CanvasRenderingContext2D, attrs: any, styles: object) => void
    checkEventOn: (coordinate: Coordinate, attrs: any, styles: object) => boolean
  }
) => void
```