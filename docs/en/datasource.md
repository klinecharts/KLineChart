# Data source

The data of a single K-line must follow the following format:
```json
{
  // require
  open: 111,
  // require
  close: 111,
  // require
  high: 111,
  // require
  low: 111,
  volume: 12,
  // If you need to display the technical indicators'EMV' and'AVP', you need to fill in data for this field.
  turnover: 1234,
  // require
  timestamp: 1610188586000
}
```


![img.png](img.png)
