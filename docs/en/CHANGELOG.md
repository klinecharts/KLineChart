# Change Log

#### Update Cycle
New versions are generally released in about two weeks (emergency versions that affect functions will be released at any time).

## 5.3.0
`Release time to be determined`
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


