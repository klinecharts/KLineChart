# 🙋 FAQ

## After the chart is initialized, only one line can be seen?

The chart always fills the container, checking to see if the container has height.

## The candle shows a line, no fluctuation, what to do?

Chart default price precision is two decimal, call `setPriceVolumePrecision(pricePrecision, volumePrecision)` to set the precision.

## How to create a real-time chart?

Through style settings.

```js
chart.setStyleOptions({
  candle: {
    type: 'area',
  },
});
```

## Built-in technical indicators, calculated data is not what you want, how to do?

You can customize technical indicators by adding an indicator template with the same `name`.

```js
// Step 1, add template
chart.addTechnicalIndicatorTemplate(template);
// Step 2，create to pane
chart.createTechnicalIndicator(name);
```

## Want to mark the point of sale, how should do?

Use annotations, `createAnnotation(annotation, paneId)`.
