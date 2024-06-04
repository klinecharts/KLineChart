# 📚 数据
图表所需要的数据必须是固定格式。通过图表实例 API [applyNewData(dataList, more)](./instance-api.md#applynewdata-datalist-more)，[applyMoreData(dataList, more)](./instance-api.md#applymoredatadatalist-more)和[updateData(data)](./instance-api.md#updatedatadata)来和图表进行数据交互。

```typescript
{
  // 时间戳，毫秒级别，必要字段
  timestamp: number
  // 开盘价，必要字段
  open: number
  // 收盘价，必要字段
  close: number
  // 最高价，必要字段
  high: number
  // 最低价，必要字段
  low: number
  // 成交量，非必须字段
  volume: number
  // 成交额，非必须字段，如果需要展示技术指标'EMV'和'AVP'，则需要为该字段填充数据。
  turnover: number
}
```


