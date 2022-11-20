# 📚 Data

The data required for the chart must be in a fixed format. Through the chart API [applyNewData(dataList, more)](/api/instance#applynewdatadatalist-more), [applyMoreData(dataList, more)](/api/instance#applymoredatadatalist-more) and [ updateData(data)](/api/instance#updatedatadata) to interact data with the chart.

```js
{
  // Open price, required fields
   open: 111,
   // Close price, required field
   close: 111,
   // Highest price, required field
   high: 111,
   // Lowest price, required field
   low: 111,
   // volume, optional field
   volume: 12,
   // Turnover, a non-required field, if you need to display the technical indicators 'EMV' and 'AVP', you need to fill this field with data.
   turnover: 1234,
   // Timestamp, millisecond, required fields
   timestamp: 1610188586000
}
```
```
