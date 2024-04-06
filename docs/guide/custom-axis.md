# 自定义坐标轴 <Badge>^9.8.0</Badge>

图表支持自定义坐标轴，可以通过图表方法 [registerXAxis(axis)](./chart-api#registerxaxis-axis) 和 [registerYAxis(axis)](./chart-api#registeryaxis-axis) 来实现。

## 入参说明
```typescript
{
  // 坐标轴名字
  name: string
  // 创建分割文字方法实现
  createTicks: (params: {
    // 区间相关的信息
    range: {
      // 起点
      from: number
      // 终点
      to: number
      // 区间长度
      range: number
      // 真实起点
      realFrom: number
      // 真实终点
      realTo: number
      // 真实区间长度
      realRange: number
    }
    // 窗口尺寸信息
    bounding: {
      // 宽
      width: number
      // 高
      height: number
      // 距离左边距离
      left: number
      // 距离右边距离
      right: number
      // 距离顶部距离
      top: number
      // 距离底部距离
      bottom: number
    }
    // 默认生成的分割文字信息
    defaultTicks: Array<{
      // 坐标位置
      coord: number
      // 值
      value: number | string
      // 展示的文字
      text: string
    }>
  }) => Array<{
    // 坐标位置
    coord: number
    // 值
    value: number | string
    // 展示的文字
    text: string
  }>
}
```

## 使用说明
当注册完成之后，即可使用图表方法 [init(ds, options)](./chart-api#init-ds-options) 参数 `options.layout` 中的子项 `options.axisOptions.name` 来指定坐标轴，或者使用实例方法 [createIndicator(value, isStack, paneOptions, callback)](./instance-api#createindicator-value-isstack-paneoptions-callback) 和 [setPaneOptions(paneOptions)](./instance-api#setpaneoptions-options) 参数 `paneOptions.axisOptions.name` 来指定。

### 使用 init 方法
```typescript
init(
  // 这里的 domId 使用自己定义的容器id代替
  `${domId}`,
  {
    layout: [
      {
        type: 'candle',
        options: {
          axisOptions: {
            // 这里的 customYAxisName 使用自定义y轴时的 name 代替
            name: `${customYAxisName}`
          }
        }
      },
      {
        type: 'xAxis',
        options: {
          position: 'bottom',
          axisOptions: {
            // 这里的 customXAxisName 使用自定义x轴时的 name 代替
            name: `${customXAxisName}`
          }
        }
      }
    ]
  }
)
```

### 使用 createIndicator 方法
```typescript
createIndicator(
  'MA',
  false,
  {
    axisOptions: {
      // 这里的 customYAxisName 使用自定义y轴时的 name 代替
      name: `${customYAxisName}`
    }
  }
)
```

### 使用 setPaneOptions 方法
```typescript
setPaneOptions({
  id: 'candle_pane',
  axisOptions: {
    // 这里的 customYAxisName 使用自定义y轴时的 name 代替
    name: `${customYAxisName}`
  }
})
```
