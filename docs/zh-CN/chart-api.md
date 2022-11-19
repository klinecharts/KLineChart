# 图表API

### init(ds, styles)
初始化一个图表，返回图表实例。
- `ds` 可以是dom元素和元素id中的一种
- `styles` 样式配置，详情可参阅[样式详情](styles.md)

### dispose(dcs)
销毁一个图表，一旦销毁，图表将不再可用。
- `dcs` 可以是div节点、节点id和图表实例中的一种

### registerFigure(template)
添加一个基础图形。
- `template` 基础图形，详情参阅[基础图形](figure.md)

### getSupportFigures()
获取图表支持的基础图形类型

### registerIndicator(template)
添加一个技术指标。
- `template` 技术指标信息，详情参阅[技术指标](indicator.md)

### getSupportIndicators()
获取图表支持的技术指标类型

### registerOverlay(template)
全局添加一个图形模板。
- `template` 图形模板，详情参阅[覆盖物](overlay.md)

### getSupportOverlays()
获取图表支持的覆盖物类型

### utils
基础方法集合。

### version()
获取图表当前版本号。




