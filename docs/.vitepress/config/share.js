import pkg from '../../../package.json'

export const version = pkg.version

export function getChartApiMenus (lang = '') {
  const prefix = `${lang}/api/chart`
  return [
    { text: 'init', link: `${prefix}/init` },
    { text: 'dispose', link: `${prefix}/dispose` },
    { text: 'version', link: `${prefix}/version` },
    { text: 'registerLocale', link: `${prefix}/registerLocale` },
    { text: 'getSupportedLocales', link: `${prefix}/getSupportedLocales` },
    { text: 'registerStyles', link: `${prefix}/registerStyles` },
    { text: 'registerFigure', link: `${prefix}/registerFigure` },
    { text: 'getSupportedFigures', link: `${prefix}/getSupportedFigures` },
    { text: 'getFigureClass', link: `${prefix}/getFigureClass` },
    { text: 'registerIndicator', link: `${prefix}/registerIndicator` },
    { text: 'getSupportedIndicators', link: `${prefix}/getSupportedIndicators` },
    { text: 'registerOverlay', link: `${prefix}/registerOverlay` },
    { text: 'getSupportedOverlays', link: `${prefix}/getSupportedOverlays` },
    { text: 'registerXAxis', link: `${prefix}/registerXAxis` },
    { text: 'registerYAxis', link: `${prefix}/registerYAxis` },
    { text: 'utils', link: `${prefix}/utils` }
  ]
}

export function getInstanceApiMenus (lang = '') {
  const prefix = `${lang}/api/instance`
  return [
    { text: 'getDom', link: `${prefix}/getDom` },
    { text: 'getSize', link: `${prefix}/getSize` },
    { text: 'setStyles', link: `${prefix}/setStyles` },
    { text: 'getStyles', link: `${prefix}/getStyles` },
    { text: 'setFormatter', link: `${prefix}/setFormatter` },
    { text: 'getFormatter', link: `${prefix}/getFormatter` },
    { text: 'setLocale', link: `${prefix}/setLocale` },
    { text: 'getLocale', link: `${prefix}/getLocale` },
    { text: 'setTimezone', link: `${prefix}/setTimezone` },
    { text: 'getTimezone', link: `${prefix}/getTimezone` },
    { text: 'setThousandsSeparator', link: `${prefix}/setThousandsSeparator` },
    { text: 'getThousandsSeparator', link: `${prefix}/getThousandsSeparator` },
    { text: 'setDecimalFold', link: `${prefix}/setDecimalFold` },
    { text: 'getDecimalFold', link: `${prefix}/getDecimalFold` },
    { text: 'setOffsetRightDistance', link: `${prefix}/setOffsetRightDistance` },
    { text: 'getOffsetRightDistance', link: `${prefix}/getOffsetRightDistance` },
    { text: 'setMaxOffsetLeftDistance', link: `${prefix}/setMaxOffsetLeftDistance` },
    { text: 'setMaxOffsetRightDistance', link: `${prefix}/setMaxOffsetRightDistance` },
    { text: 'setLeftMinVisibleBarCount', link: `${prefix}/setLeftMinVisibleBarCount` },
    { text: 'setRightMinVisibleBarCount', link: `${prefix}/setRightMinVisibleBarCount` },
    { text: 'setBarSpace', link: `${prefix}/setBarSpace` },
    { text: 'getBarSpace', link: `${prefix}/getBarSpace` },
    { text: 'setSymbol', link: `${prefix}/setSymbol` },
    { text: 'getSymbol', link: `${prefix}/getSymbol` },
    { text: 'setPeriod', link: `${prefix}/setPeriod` },
    { text: 'getPeriod', link: `${prefix}/getPeriod` },
    { text: 'setDataLoader', link: `${prefix}/setDataLoader` },
    { text: 'resetData', link: `${prefix}/resetData` },
    { text: 'getDataList', link: `${prefix}/getDataList` },
    { text: 'getVisibleRange', link: `${prefix}/getVisibleRange` },
    { text: 'createIndicator', link: `${prefix}/createIndicator` },
    { text: 'overrideIndicator', link: `${prefix}/overrideIndicator` },
    { text: 'getIndicators', link: `${prefix}/getIndicators` },
    { text: 'removeIndicator', link: `${prefix}/removeIndicator` },
    { text: 'createOverlay', link: `${prefix}/createOverlay` },
    { text: 'overrideOverlay', link: `${prefix}/overrideOverlay` },
    { text: 'getOverlays', link: `${prefix}/getOverlays` },
    { text: 'removeOverlay', link: `${prefix}/removeOverlay` },
    { text: 'setPaneOptions', link: `${prefix}/setPaneOptions` },
    { text: 'getPaneOptions', link: `${prefix}/getPaneOptions` },
    { text: 'setZoomEnabled', link: `${prefix}/setZoomEnabled` },
    { text: 'isZoomEnabled', link: `${prefix}/isZoomEnabled` },
    { text: 'setScrollEnabled', link: `${prefix}/setScrollEnabled` },
    { text: 'isScrollEnabled', link: `${prefix}/isScrollEnabled` },
    { text: 'scrollByDistance', link: `${prefix}/scrollByDistance` },
    { text: 'scrollToRealTime', link: `${prefix}/scrollToRealTime` },
    { text: 'scrollToDataIndex', link: `${prefix}/scrollToDataIndex` },
    { text: 'scrollToTimestamp', link: `${prefix}/scrollToTimestamp` },
    { text: 'zoomAtCoordinate', link: `${prefix}/zoomAtCoordinate` },
    { text: 'zoomAtDataIndex', link: `${prefix}/zoomAtDataIndex` },
    { text: 'zoomAtTimestamp', link: `${prefix}/zoomAtTimestamp` },
    { text: 'convertToPixel', link: `${prefix}/convertToPixel` },
    { text: 'convertFromPixel', link: `${prefix}/convertFromPixel` },
    { text: 'executeAction', link: `${prefix}/executeAction` },
    { text: 'subscribeAction', link: `${prefix}/subscribeAction` },
    { text: 'unsubscribeAction', link: `${prefix}/unsubscribeAction` },
    { text: 'getConvertPictureUrl', link: `${prefix}/getConvertPictureUrl` },
    { text: 'resize', link: `${prefix}/resize` }
  ]
}
