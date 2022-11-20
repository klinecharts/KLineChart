# 🙋 常见问题

## 初始化图表后，只能看到一条线，是怎么回事？

图表总是会填充容器，检查一下容器是否有高度。

## 蜡烛柱显示趋近于一条线，看不到波动，怎么办？

图表默认价格精度为两位小数，调用`setPriceVolumePrecision(pricePrecision, volumePrecision)`设置下精度。

## 分时图怎么创建？

通过样式设置。

```js
chart.setStyleOptions({
  candle: {
    type: 'area',
  },
});
```

## 内置的技术指标，计算出来的数据不是想要的，怎么办？

图表支持自定义技术指标，添加一个`name`一致的指标模板即可。

```js
// 第1步，添加模板
chart.addTechnicalIndicatorTemplate(template);
// 第2步，创建到窗口
chart.createTechnicalIndicator(name);
```

## 想标记一下买卖点，该怎么做？

可以使用注解，`createAnnotation(annotation, paneId)`。
