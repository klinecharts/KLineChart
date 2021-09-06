# 图表API

### init(ds, options)
初始化一个图表，返回图表实例。
- `ds` 可以是dom元素和元素id中的一种
- `options` 样式配置，详情可参阅[样式详情](styles.md)


### dispose(dcs)
销毁一个图表，一旦销毁，图表将不再可用。
- `dcs` 可以是div节点、节点id和图表实例中的一种


### extension.addTechnicalIndicatorTemplate(template)
全局添加一个技术指标。
- `template` 技术指标信息，详情参阅[技术指标](technical-indicator.md)


### extension.addShapeTemplate(template)
全局添加一个图形模板。
- `template` 图形模板，详情参阅[图形标记](shape.md)


### version()
获取图表当前版本号。




