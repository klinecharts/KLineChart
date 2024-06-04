# 🙋 常见问题

## 初始化图表后，只能看到一条线，是怎么回事？
图表总是会填充容器，检查一下容器是否有高度。

## 蜡烛柱显示趋近于一条线，看不到波动，怎么办？
图表默认价格精度为两位小数，调用`setPriceVolumePrecision(pricePrecision, volumePrecision)`设置下精度。

## 分时图怎么创建？
通过样式设置。

```javascript
chart.setStyles({
  candle: {
    type: 'area',
  },
});
```

## 内置的技术指标，计算出来的数据不是想要的，怎么办？
可以通过图表方法`createIndicator`或者`overrideIndicator`重写`calc`即可。

## 想创建一个内置技术指标之外的指标，怎么办？
图表支持自定义技术指标，详情参阅[技术指标](/guide/indicator)。

## 想标记一下买卖点，该怎么做？
可以使用覆盖物，内置的覆盖物有一个`simpleAnnotation`，用图表api创建即可`createOverlay({ name: 'simpleAnnotation', ... }, paneId)`。
