# Change Log

## 5.6.0
`2020-08-29`
+ 🆕 Add `render` property for custom technical indicators.
+ 🆕 Custom indicator api `calcTechnicalIndicator`, add parameter `plots`.
+ 🆕 Add `xAxis.height` and `yAxis.width` to configuration items.
+ 🆕 Add api `subscribeDrawAction` and `unsubscribeDrawAction` for drawing monitoring and cancellation.
+ 🆕 Add api `getTimezone`.
+ 👉 Api `getTechnicalIndicatorParamOptions` changed to `getTechnicalIndicatorParams`。
+ 👉 The built-in indicator text prompt shows that `xxxMa` is changed to `maXxx`.
+ 🗑 Remove the configuration item `floatLayer.prompt.technicalIndicator.point`.

## 5.5.1
`2020-08-16`
+ 💄 When there is no data, the y-axis is displayed.
+ 💄 Optimize the default main chart technical indicator type, the default chart is simpler.
+ 💄 Optimize performance and reduce useless calculations.
+ 🐞 Fix the problem that the y-axis cannot be displayed and displayed incorrectly when switching the chart type and the newly added secondary chart indicator.
+ 🐞 Fix the problem that cannot be merged correctly when configuration is a method.
+ 👉 `xAxis.tickText.margin` changed to `xAxis.tickText.paddingTop` and `xAxis.tickText.paddingBottom`.
+ 👉 `yAxis.tickText.margin` changed to `yAxis.tickText.paddingLeft` and `yAxis.tickText.paddingRight`.

## 5.5.0
`2020-07-26`
+ 🆕 Add back the technical indicator ohlc display.
+ 🆕 Add text `weight` configuration.
+ 🆕 A new `shouldFormatBigNumber` property is added to the custom technical indicators, which is used to inform the chart whether larger numbers need to be formatted.
+ 🆕 New api `setTechnicalIndicatorPrecision`.
+ 💄 Optimize the data display after moving the mouse over the chart, and display the last data instead.
+ 💄 Optimize the starting position of chart drawing when loading new data.
+ 💄 Optimize the internal dom element level to reduce nesting.
+ 💄 Optimize the prompt text display of `VOL`.
+ 🐞 Fix the problem that illegal technical indicator calculation parameters may cause the chart to crash.
+ 👉 The style configuration `yAxis.tickText.position` is changed to `yAxis.inside`.
+ 👉 The default font family is changed from `Arial` to `Helvetica Neue`.
+ 👉 The custom technical indicator attribute `isPriceTechnicalIndicator` becomes `series`, and the value is changed to `price`, `volume` and `normal`.
+ 🗑 Remove the x-axis `minHeight` and `maxHeight` configuration, change to height adaptive.
+ 🗑 Remove the y-axis `minWidth` and `maxWidth` configuration, change to width adaptive.

## 5.3.0
`2020-05-26`
+ 🛠 Refactoring technical indicator module.
+ 💄 The optimization method `formatDate` is called frequently and the resource occupation is too high.
+ 💄 Optimized to load more trigger mechanisms, instead of zooming, scrolling will trigger.
+ 💄 Optimize the Y axis to calculate the maximum and minimum values.
+ 🆕 The new method `addCustomTechnicalIndicator` is used to add custom technical indicators to the chart.
+ 👉 The method `addTechnicalIndicator` was changed to` createTechnicalIndicator`.
+ 🗑 Remove the technical indicators and draw ohlc.

## 5.2.2
`2020-05-11`
+ 🐞 Solve the problem that some browsers can't render the chart without `Intl`.

## 5.2.1
`2020-05-09`
+ 🐞 Fix the problem that the prompt text of `showType: 'rect'` is not displayed when the main image is a time-sharing image.
+ 🐞 Fix the problem that the x-axis does not display time when there is only one data.
+ 🐞 Fix the problem that the chart cannot be refreshed accurately when the data changes.
+ 💄 Optimize x-axis split calculation.
+ 💄 Optimized the display of `VOL` technical indicators.
+ 🆕 The third parameter is added in the `addTechnicalIndicator` method to set whether the technical indicator graph can be dragged to adjust the height.

## 5.2.0
`2020-04-25`
+ 🐞 Fix the problem that the `setTimezone` method cannot take effect in real time.
+ 🐞 Fix the problem that the entire chart will be exceeded when adjusting the height of the technical indicator chart.
+ 💄 Optimize keyboard events `shift + ↑` and `shift + ↓` sensitivity.
+ 💄 Optimize the width of the default candlestick.
+ 💄 Optimize the mouse style when the chart is dragged and scrolled.
+ 🆕 The `getConvertPictureUrl` method adds a new parameter to set the background color of the picture.
+ 🆕 New method `setLeftMinVisibleBarCount` is used to set the minimum number of bars visible on the left.
+ 🆕 New method `setRightMinVisibleBarCount` is used to set the minimum number of bars visible on the right.
+ 🆕 Added font style attributes in style configuration.
+ 🆕 Added the final value display configuration of technical indicators.
+ 🆕 Added technical indicator `EMA`.

## 5.1.1
`2020-04-10`
+ 🐞 Fix the issue of invalid method call of removeTechnicalIndicator.
+ 🐞 Fix the problem that the chart cannot fill the root container in some specific cases.
+ 💄 Optimize the minimum width of the candlestick.

## 5.1.0
`2020-03-27`
+ 🐞 Fix the problem that `setStyleOptions` method is called and cannot take effect in real time.
+ 🐞 Fix the problem that the text displayed by the cross cursor is incorrect when the configuration setting `{yAxis: {position: 'left'}}`.
+ 💄 Optimized drag to adjust the height sensitivity of the technical indicator graph.
+ 🆕 The style configuration adds the current technical indicator value indication point display configuration.
+ 🆕 The style configuration adds a percentage y-axis configuration.

## 5.0.0
`2020-03-25`
+ 🛠 The whole chart is refactored, and the new APIs are convenient for expanding functions.
+ 🐞 Fix the mobile terminal zoom event response problem.
+ 💄 Optimize scrolling and zoom fluency.
+ 🆕 The style configuration adds no change color attribute `noChangeColor`.
+ 🆕 New method `setTimezone` is used to set the chart time zone.
+ 🆕 New method `setPrecision` is used to set price and quantity precision.
+ 🆕 The number of technical indicator charts is not limited, and can be added by the method `addTechnicalIndicator`.
+ 🆕 The technical indicator chart can be adjusted in height by dragging.

## 4.1.0
`2020-01-19`
+ 🐞 Fix the display problem when the maximum and minimum values of the y-axis are all 0.
+ 💄 Optimize the default configuration of dashed line parameters and time-sharing line colors.
+ 💄 Optimized the problem that the chart will scroll up and down when scrolling on individual wheels.
+ 💄 Optimize indicator calculation and call logic to reduce useless method calls.

## 4.0.0
`2019-12-30`
+ 🐞 Fix the problem of `merge` method that cannot merge data correctly.
+ 💄 Optimize the height of the default technical indicator graph.
+ 🆕 New method `loadMore` is used to load historical data in sections.
+ 🆕 Added keyboard shortcuts `shift + ←`, `shift + →`, `shift + ↑`, `shift + ↓` for zooming and scrolling.
+ 🆕 Added the function of setting technical index calculation parameters.
+ 🆕 Added technical indicator `SAR`.

## 3.0.0
`2019-12-16`
+ 🆕 Support technical indicators.
+ 🆕 Support custom styles.
+ 🆕 Support mobile devices.


