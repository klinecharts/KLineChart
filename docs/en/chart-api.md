# Chart API

### init(ds, options)
Initialize a chart and return the chart instance.

- `ds` can be one of dom element and element id
- `options` style configuration, please refer to [style details](styles.md)



### dispose(dcs)
Destroy a chart. Once destroyed, the chart will no longer be usable.

- `dcs` can be one of div node, node id and chart instance



### extension.addTechnicalIndicator(technicalIndicator)
Add a technical indicator globally.

- `technicalIndicator` technical indicator information, please refer to [technical indicator](technical-indicator.md)



### extension.addGraphicMark(graphicMark)
Add a graphic mark globally.

- `graphicMark` graphic mark information, please refer to [graphic mark](graphic-mark.md)



### version()
Get the current version number of the chart.




