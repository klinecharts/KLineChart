# 📚 Data

The data required by the chart must be in a fixed format. Use the chart instance API [setDataLoader(loader)](/en-US/api/instance/setDataLoader) to interact with the chart.

```typescript
{
  // Timestamp, millisecond, required fields
  timestamp: number
  // Open price, required fields
  open: number
  // Close price, required field
  close: number
  // Highest price, required field
  high: number
  // Lowest price, required field
  low: number
  // volume, optional field
  volume: number
  // Turnover, a non-required field, if you need to display the technical indicators 'EMV' and 'AVP', you need to fill this field with data.
  turnover: number
}
```
