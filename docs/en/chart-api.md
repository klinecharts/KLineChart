# Chart API

### init(ds, options)
Initialize a chart and return the chart instance.
- `ds` can be one of dom element and element id
- `options` style configuration, please refer to [style details](styles.md)


### dispose(dcs)
Destroy a chart. Once destroyed, the chart will no longer be usable.
- `dcs` can be one of div node, node id and chart instance


### extension.addTechnicalIndicatorTemplate(template)
Add a technical indicator template globally.
- `template` technical indicator template, please refer to [technical indicator](technical-indicator.md)


### extension.addShapeTemplate(template)
Add a shape template globally.
- `template` shape template, please refer to [shape](shape.md)


### version()
Get the current version number of the chart.




