import { init, registerFigure, registerOverlay } from 'klinecharts';

registerFigure({
  name: 'diamond',
  draw: (ctx, attrs, styles) => {
    const { x, y, width, height } = attrs;
    const { color } = styles;
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x, y - height / 2);
    ctx.lineTo(x + width / 2, y);
    ctx.lineTo(x, y + height / 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  },
  checkEventOn: (coordinate, attrs) => {
    const { x, y } = coordinate;
    const { width, height } = attrs;
    return Math.abs(x * height) + Math.abs(y * width) <= width * height / 2;
  }
});

registerOverlay({
  name: 'customOverlay',
  totalStep: 2,
  createPointFigures: ({ coordinates }) => {
    return {
      type: 'diamond',
      attrs: {
        x: coordinates[0].x,
        y: coordinates[0].y,
        width: 50,
        height: 50
      },
      styles: { color: '#a0a7e6' }
    }
  }
});

const chart = init('custom-figure-custom-overlay-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => {
    chart.applyNewData(dataList);
    const data = dataList[dataList.length - 10];
    chart.createOverlay({
      name: 'customOverlay',
      points: [{ timestamp: data.timestamp, value: data.close }]
    })
  });
