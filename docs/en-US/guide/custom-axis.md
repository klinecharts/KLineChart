# Custom Axis <Badge>^9.8.0</Badge>

Chart support custom axis, which can be achieved through the chart api [registerXAxis(axis)](./chart-api#registerxaxis-axis) and [registerYAxis(axis)](./chart-api#registeryaxis-axis).

## Input params introduction
```typescript
{
  // axis name
  name: string
  // implementation of create ticks
  createTicks: (params: {
    // range info
    range: {
      from: number
      to: number
      range: number
      realFrom: number
      realTo: number
      realRange: number
    }
    // viewport
    bounding: {
      width: number
      height: number
      left: number
      right: number
      top: number
      bottom: number
    }
    // default ticks info
    defaultTicks: Array<{
      coord: number
      value: number | string
      text: string
    }>
  }) => Array<{
    coord: number
    value: number | string
    text: string
  }>
}
```

## Usage
After register completed, you can use the sub item `options.axisOptions.name` in the `options.layout` parameter of the chart api [init(ds, options)](./chart-api#init-ds-options) to specify the coordinate axis, or use the instance api [createIndicator(value, isStack, paneOptions, callback)](./instance-api#createindicator-value-isstack-paneoptions-callback) and [setPaneOptions(paneOptions)](./instance-api#setpaneoptions-options) parameter `paneOptions.axisOptions.name` to specify it.

### Using init of chart api
```typescript
init(
  // The domId here uses its own defined container ID instead
  `${domId}`,
  {
    layout: [
      {
        type: 'candle',
        options: {
          axisOptions: {
            // The customYAxisName here uses the name used when customizing the y-axis instead
            name: `${customYAxisName}`
          }
        }
      },
      {
        type: 'xAxis',
        options: {
          position: 'bottom',
          axisOptions: {
            // The customXAxisName here uses the name used when customizing the x-axis instead
            name: `${customXAxisName}`
          }
        }
      }
    ]
  }
)
```

### Using createIndicator of instance api
```typescript
createIndicator(
  'MA',
  false,
  {
    axisOptions: {
      // The customYAxisName here uses the name used when customizing the y-axis instead
      name: `${customYAxisName}`
    }
  }
)
```

### Using setPaneOptions of instance api
```typescript
setPaneOptions({
  id: 'candle_pane',
  axisOptions: {
    // The customYAxisName here uses the name used when customizing the y-axis instead
    name: `${customYAxisName}`
  }
})
```
