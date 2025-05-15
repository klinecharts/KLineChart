import { getFigureClass } from 'klinecharts'

const Figure = getFigureClass('rect')
new Figure({
  name: 'rect',
  attrs: { x: 10, y: 10, width: 100, height: 100 },
  styles: { color: 'red' }
}).draw(ctx)
