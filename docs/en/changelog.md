# 📠 Change Log
## 9.0.1
`2023-02-17`
🐞 Fix the introduction of typescript.

## 9.0.0
`2023-02-16`
+ 🛠 Typescript refactoring.
+ 🆕 New features
   + Add Y axis direction zoom and scroll.
   + API
     + New chart methods `registerFigure`, `getSupportFigures`, `getFigureClass`, `rigiderOverlay`, `getSupportOverlays`, `registerLocale`, `getSupportLocales`, `registerStyles` are added.
     + New instance methods, `getSize`, `setLocale`, `getLocal`, `setCustomApi`, `getVisibleRange`, `createOverlay`, `getOverlayById`, `overrideOverlay`, `removeOverlay`.
   + Style Configuration
     + Add `candle.priceMark.last.text.borderStyle`, `candle.tooltip.icons`, `indicator.lastValueMark.text.borderStyle`, `indicator.tooltip.icons`, `crosshair.horizontal. text.borderStyle`, `crosshair.vertical.text.borderStyle`.
+ 👉 Change
   + API
      + Chart method `extension.addTechnicalIndicatorTemplate` is changed to `registerIndicator`.
      + Chart method `extension.addShapeTemplate` is changed to `registerOverlay`.
      + Instance method `setStyleOptions` is changed to `setStyles`.
      + Instance method `getStyleOptions` is changed to `getStyles`.
      + Instance method `setPaneOptions(options)`, `options` add new attribute `gap`.
      + Instance method `setOffsetRightSpace` is changed to `setOffsetRightDistance`.
      + Instance method `createTechnicalIndicator` is changed to `createIndicator`
      + Instance method `overlayTechnicalIndicator` is changed to `overrideIndicator`.
      + Instance method `getTechnicalIndicatorByPaneId` is changed to `getIndicatorByPaneId`.
      + Instance method `removeTechnicalIndicator` is changed to `removeIndicator`.
   + Style Configuration
      + All `line.style` options are changed to `solid` and `dashed`.
      + All `dashValue` is changed to `dashedValue`.
      + `xAxis.height` is changed to `xAxis.size`, `xAxis.tickeText.paddingTop` is changed to `xAxis.tickeText.marinStart`, and `xAxis.tickeText.paddingBottom` is changed to `xAxis.tickeText.marinEnd`.
      + `yAxis.height` is changed to `yAxis.size`, `yAxis.tickeText.paddingTop` is changed to `yAxis.tickeText.marinStart`, and `yAxis.tickeText.paddingBottom` is changed to `yAxis.tickeText.marinEnd`.
      + `technicalIndicator.bar` is changed to `indicator.bars`, `technicalIndicator.line` is changed to `indicator.lines`，`technicalIndicator.circle` is changed to `indicator.circles`
   + Custom Extension
      + The technical indicator attribute `calcParams` has been changed to support any type.
      + The technical indicator attribute `plots` is changed to `figures`.
      + The technical indicator attribute `regeneratePlots` is changed to' regeneratefigures'.
      + The technical indicator attribute `calcTechnicalIndicator` is changed to `calc`.
      + The technical indicator attribute `render` is changed to 'draw'.
+ 🗑 Abandonment
   + API
      + Delete instance methods `getWidth`, `getHeight`, and use `getSize` instead.
      + Delete instance methods `createShape`, `createAnnotation`, `createTag`, and use `createOverlay` instead.
      + Delete instance methods `removeShape`, `removeAnnotation`, `removeTag`. Use `removeOverlay` instead.
      + Delete the instance method `setShapeOptions` and use `overrideOverlay` instead.
      + Delete instance methods `createHtml`, `removeHtml`, `addTechnicalIndicatorTemplate`, `getTechnicalIndicatorTemplate`, `addShapeTemplate`.
   + Style Configuration
      + Delete `shape`, `annotation`, `tag` and use `overlay` instead.
      + Delete `candle.margin`，`technicalIndicator.margin`。
   + Custom Extension
      + The related attributes are no longer saved in the technical indicator template.
      + Delete `Shape` and use `Overlay` instead.

## 8.x

Go to [Github](https://github.com/liihuu/KLineChart/blob/v8.6.3/docs/en/changelog.md) to check the change log for 8.x.

## 7.x

Go to [Github](https://github.com/liihuu/KLineChart/blob/v7.5.0/docs/en/changelog.md) to check the change log for 7.x.

## 6.x

Go to [Github](https://github.com/liihuu/KLineChart/blob/v6.1.0/docs/en/CHANGELOG.md) to check the change log for 6.x.

## 5.x

Go to [Github](https://github.com/liihuu/KLineChart/releases/tag/v5.0.0) to view the 5.x release notes.

## 4.x

Go to [Github](https://github.com/liihuu/KLineChart/releases/tag/v4.0.0) to view the 4.x release notes.
