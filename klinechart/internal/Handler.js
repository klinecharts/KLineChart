class Handler {
  constructor () {
    // 绘制区域参数
    this.contentRect = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
    // 整个view的高度
    this.height = 0
    // 整个view的宽度
    this.width = 0
  }

  /**
   * 设置尺寸
   * @param width
   * @param height
   * @param offsetLeft
   * @param offsetRight
   * @param offsetTop
   * @param offsetBottom
   */
  setDimensions (width, height, offsetLeft, offsetRight, offsetTop, offsetBottom) {
    this.width = width
    this.height = height
    this.contentRect.left = offsetLeft
    this.contentRect.right = offsetRight
    this.contentRect.top = offsetTop
    this.contentRect.bottom = offsetBottom
  }

  contentTop () {
    return this.contentRect.top
  }

  contentLeft () {
    return this.contentRect.left
  }

  contentRight () {
    return this.width - this.contentRect.right
  }

  contentBottom () {
    return this.height - this.contentRect.bottom
  }

  /**
   * 获取中间点坐标
   */
  getContentCenter () {
    const point = {}
    point.x = (this.contentLeft() + this.contentRight()) / 2
    point.y = (this.contentTop() + this.contentBottom()) / 2
    return point
  }
}

export default Handler
