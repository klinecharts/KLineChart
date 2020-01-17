import Chart from './Chart'
import TooltipRender from '../render/TooltipRender'
import { IndicatorType, YAxisPosition, YAxisTextPosition, ChartType, TooltipTextDisplayRule, MarkerType } from '../internal/constants'

class TooltipChart extends Chart {
  constructor (dom, style, mainChart, volChart, subIndicatorChart, xAxisChart, dataProvider, indicatorParams) {
    super(dom, style)
    this.mainChart = mainChart
    this.volChart = volChart
    this.subIndicatorChart = subIndicatorChart
    this.dataProvider = dataProvider
    this.tooltipRender = new TooltipRender(
      this.viewPortHandler, dataProvider, indicatorParams,
      mainChart.viewPortHandler, volChart.viewPortHandler, subIndicatorChart.viewPortHandler,
      mainChart.yAxisRender, volChart.yAxisRender, subIndicatorChart.yAxisRender
    )
  }

  draw () {
    const kLineData = this.dataProvider.dataList[this.dataProvider.currentTooltipDataPos] || {}
    const tooltip = this.style.tooltip
    // 如果不是绘图才显示十字线
    if (this.dataProvider.currentMarkerType === MarkerType.NONE && !this.dataProvider.isDragMarker) {
      this.tooltipRender.renderCrossHorizontalLine(
        this.ctx,
        this.mainChart.indicatorType,
        this.subIndicatorChart.indicatorType,
        this.style.yAxis.position === YAxisPosition.LEFT,
        this.style.yAxis.tick.text.position === YAxisTextPosition.OUTSIDE,
        tooltip
      )
      this.tooltipRender.renderCrossVerticalLine(this.ctx, kLineData, tooltip)
    }
    if (this.dataProvider.dataList.length > 0) {
      const tooltipData = tooltip.data
      if (tooltipData.displayRule === TooltipTextDisplayRule.ALWAYS ||
        (tooltipData.displayRule === TooltipTextDisplayRule.FOLLOW_CROSS && this.dataProvider.crossPoint)) {
        const indicator = this.style.indicator

        this.tooltipRender.renderMainChartTooltip(
          this.ctx, kLineData,
          this.mainChart.indicatorType,
          this.mainChart.chartType === ChartType.CANDLE,
          tooltip, indicator
        )
        if (this.volChart.indicatorType !== IndicatorType.NO) {
          this.tooltipRender.renderIndicatorChartTooltip(
            this.ctx, this.mainChart.viewPortHandler.height,
            kLineData, IndicatorType.VOL, tooltip, indicator, true
          )
        }
        if (this.subIndicatorChart.indicatorType !== IndicatorType.NO) {
          this.tooltipRender.renderIndicatorChartTooltip(
            this.ctx, this.mainChart.viewPortHandler.height + this.volChart.viewPortHandler.height,
            kLineData, this.subIndicatorChart.indicatorType, tooltip, indicator
          )
        }
      }
    }
  }
}

export default TooltipChart
