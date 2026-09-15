---
outline: deep
---

# setLayoutOptions(layout)
`setLayoutOptions` set the chart default layout options. It only affects panes and y-axes created after the call, existing panes and y-axes remain unchanged. Incremental values ​​are supported.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setLayoutOptions.md-->

### Parameters {#parameters}
- `layout` Layout options.
  - `barSpaceLimit` Bar space limit.
  - `pane` Pane default options.
  - `yAxis` Y-axis default options.

### Returns {#returns}
`setLayoutOptions` returns `undefined` .

## Usage {#usage}
```javascript
chart.setLayoutOptions({
  yAxis: {
    inside: true,
    position: 'left'
  }
})
```
