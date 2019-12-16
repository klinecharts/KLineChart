import Chart from './Chart'
import TooltipRender from '../render/TooltipRender'
import { IndicatorType, YAxisPosition, YAxisTextPosition, MainChartType, TooltipTextDisplayRule, MarkerType } from '../internal/constants'

class TooltipChart extends Chart {
  constructor (dom, config, candleChart, volChart, subIndicatorChart, xAxisChart, dataProvider) {
    super(dom, config)
    this.candleChart = candleChart
    this.volChart = volChart
    this.subIndicatorChart = subIndicatorChart
    this.dataProvider = dataProvider
    this.tooltipRender = new TooltipRender(
      this.viewPortHandler, dataProvider,
      candleChart.viewPortHandler, volChart.viewPortHandler, subIndicatorChart.viewPortHandler,
      candleChart.yAxisRender, volChart.yAxisRender, subIndicatorChart.yAxisRender
    )
  }

  draw () {
    const kLineData = this.dataProvider.dataList[this.dataProvider.currentTooltipDataPos] || {}
    const tooltip = this.config.tooltip
    // 如果不是绘图才显示十字线
    if (this.dataProvider.currentMarkerType === MarkerType.NONE && !this.dataProvider.isDragMarker) {
      this.tooltipRender.renderCrossHorizontalLine(
        this.ctx,
        this.candleChart.indicatorType,
        this.subIndicatorChart.indicatorType,
        this.config.yAxis.position === YAxisPosition.LEFT,
        this.config.yAxis.tick.text.position === YAxisTextPosition.OUTSIDE,
        tooltip
      )
      this.tooltipRender.renderCrossVerticalLine(this.ctx, kLineData, tooltip)
    }
    const tooltipData = tooltip.data
    if (tooltipData.displayRule === TooltipTextDisplayRule.ALWAYS ||
      (tooltipData.displayRule === TooltipTextDisplayRule.FOLLOW_CROSS && this.dataProvider.crossPoint)) {
      const indicator = this.config.indicator

      this.tooltipRender.renderMainChartTooltip(
        this.ctx, kLineData,
        this.candleChart.indicatorType,
        this.config.candle.chartType === MainChartType.CANDLE,
        tooltip, indicator
      )
      if (this.volChart.indicatorType !== IndicatorType.NO) {
        this.tooltipRender.renderIndicatorChartTooltip(
          this.ctx, this.candleChart.viewPortHandler.height,
          kLineData, IndicatorType.VOL, tooltip, indicator, true
        )
      }
      if (this.subIndicatorChart.indicatorType !== IndicatorType.NO) {
        this.tooltipRender.renderIndicatorChartTooltip(
          this.ctx, this.candleChart.viewPortHandler.height + this.volChart.viewPortHandler.height,
          kLineData, this.subIndicatorChart.indicatorType, tooltip, indicator
        )
      }
    }
  }
}

export default TooltipChart
