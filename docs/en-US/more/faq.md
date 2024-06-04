# 🙋 FAQ

## After the chart is initialized, only one line can be seen?
The chart always fills the container, checking to see if the container has height.

## The candle shows a line, no fluctuation, what to do?
Chart default price precision is two decimal, call `setPriceVolumePrecision(pricePrecision, volumePrecision)` to set the precision.

## How to create a real-time chart?
Through style settings.
```javascript
chart.setStyles({
  candle: {
    type: 'area',
  },
});
```

## Built-in technical indicators, calculated data is not what you want, how to do?
You can override `calc` by the chart method `createIndicator` or `overrideIndicator`.

## What if I want to create an indicator other than the built-in technical indicator?
Charts support custom technical indicators, see [indicators](/en-US/guide/indicator) for details.

## Want to mark the point of sale, how should do?
Overlays can be used. The built-in overlay has a `simpleAnnotation`, which can be created with the chart api `createOverlay({ name: 'simpleAnnotation', ... }, paneId)`.
