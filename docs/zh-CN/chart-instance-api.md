## 图表实例方法

#### [setStyleOptions(options: any)]()
设置当前图表的样式。

```options```: 样式的配置，配置详情可参考[style](style.md)


#### [getStyleOptions()]()
获取当前图表的样式。


#### [setTechnicalIndicatorParams(technicalIndicatorType, params)]()
设置当前图表的技术指标计算参数。

```technicalIndicatorType```: 技术指标类型，具体类型可参考[technical-indicator-type](technical-indicator-type.md)

```params```: 技术指标的计算参数，具体参数可参考[technical-indicator-type](technical-indicator-type.md)



#### [getTechnicalIndicatorParamOptions()]()
获取当前图表的所有技术指标计算参数。

#### [setPrecision(pricePrecision, volumePrecision)]()
设置精度。

```pricePrecision```: 价格精度，影响整个图表显示的价格的数字精度，还包括技术指标MA, EMA, BOLL, SAR，不包括y轴刻度值

```volumePrecision```: 数量精度，影响整个图表显示的数量的数字精度，不包括y轴刻度值



#### [setTimezone(timezone)]()
设置时区。

```timezone```: 时区对应的值。如: 'Asia/Shanghai'。不设置会获取本机时区



#### [resize()]()
调整图表大小，总是会填充图表容器大小。

```注意：此方法会重新计算整个图表各个模块的大小，频繁调用可能会影响到性能，调用请谨慎。```



#### [setOffsetRightSpace(space)]()
#### [setLeftMinVisibleBarCount(barCount)]()
#### [setRightMinVisibleBarCount(barCount)]()
#### [setDataSpace(space)]()
#### [clearData()]()
#### [getDataList()]()
#### [applyNewData(dataList, more)]()
#### [applyMoreData(dataList, more)]()

#### [updateData(data)]()
#### [loadMore(cb)]()
#### [setCandleStickChartType(chartType)]()

#### [setCandleStickTechnicalIndicatorType(technicalIndicatorType)]()
#### [setTechnicalIndicatorType(tag, technicalIndicatorType)]()
#### [addTechnicalIndicator(technicalIndicatorType, height)]()
#### [removeTechnicalIndicator(tag)]()
#### [addGraphicMark(graphicMark)]()
#### [removeAllGraphicMark()]()
#### [getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type)]()

