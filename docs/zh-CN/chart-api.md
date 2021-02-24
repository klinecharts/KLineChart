# 图表API

### init(ds, options)
初始化一个图表，返回图表实例。

- `ds` 可以是dom元素、元素id和元素class中的一种
- `options` 样式配置，详情可参阅[样式详情](styles.md)



### dispose(dcs)
销毁一个图表，一旦销毁，图表将不再可用。

- `dcs` 可以是div节点、节点id、节点class和图表实例中的一种



### extension.addTechnicalIndicator(technicalIndicator)
全局添加一个技术指标。

- `technicalIndicator` 技术指标信息，详情参阅[技术指标](technical-indicator.md)



### extension.addGraphicMark(graphicMark)
全局添加一个图形标记。

- `graphicMark` 图形标记信息，详情参阅[图形标记](graphic-mark.md)



### version()
获取图表当前版本号。




