# Chart API

### init(ds, styles)
Initialize a chart and return the chart instance.
- `ds` can be one of dom element and element id
- `styles` style configuration, please refer to [style details](styles.md)

### dispose(dcs)
Destroy a chart. Once destroyed, the chart will no longer be usable.
- `dcs` can be one of div node, node id and chart instance


### registerFigure(template)
Add a base drawing.
- `template` basic graphics. For details, see [figure](figure.md)


### getSupportFigures()
Get the basic graph types supported by the chart

### registerIndicator(template)
Add a technical indicator template.
- `template` technical indicators. For details, see [technical indicators](indicator.md)

### getSupportIndicators()
Get the technical indicator types supported by the chart

### registerOverlay(template)
Add a overlay template.
- `template` overlay template. For details, see [overlay](overlay.md)

### getSupportOverlays()
Get the overlay types supported by the chart

### utils
Collection of basic methods.

### version()
Get the current version number of the chart.




