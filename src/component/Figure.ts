/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type Coordinate from '../common/Coordinate'

import Eventful from '../common/Eventful'
import type { MouseTouchEvent } from '../common/SyntheticEvent'

export const DEVIATION = 2

export interface Figure<A = unknown, S = unknown> {
  name: string
  attrs: A
  styles: S
  draw: (ctx: CanvasRenderingContext2D, attrs: A, styles: S) => void
  checkEventOn: (coordinate: Coordinate, attrs: A, styles: S) => boolean
}

export type FigureTemplate<A = unknown, S = unknown> = Pick<Figure<A, S>, 'name' | 'draw' | 'checkEventOn'>

export type FigureCreate<A = unknown, S = unknown> = Pick<Figure<A, S>, 'name' | 'attrs' | 'styles'>

export type FigureConstructor<A = unknown, S = unknown> = new (figure: FigureCreate<A, S>) => ({ draw: (ctx: CanvasRenderingContext2D) => void })
export type FigureInnerConstructor<A = unknown, S = unknown> = new (figure: FigureCreate<A, S>) => FigureImp<A, S>
export default abstract class FigureImp<A = unknown, S = unknown> extends Eventful implements Omit<Figure<A, S>, 'name' | 'draw' | 'checkEventOn'> {
  attrs: A
  styles: S

  constructor (figure: FigureCreate<A, S>) {
    super()
    this.attrs = figure.attrs
    this.styles = figure.styles
  }

  checkEventOn (event: MouseTouchEvent): boolean {
    return this.checkEventOnImp(event, this.attrs, this.styles)
  }

  setAttrs (attrs: A): this {
    this.attrs = attrs
    return this
  }

  setStyles (styles: S): this {
    this.styles = styles
    return this
  }

  draw (ctx: CanvasRenderingContext2D): void {
    this.drawImp(ctx, this.attrs, this.styles)
  }

  abstract checkEventOnImp (event: MouseTouchEvent, attrs: A, styles: S): boolean

  abstract drawImp (ctx: CanvasRenderingContext2D, attrs: A, styles: S): void

  static extend<A, S> (figure: FigureTemplate<A, S>): new (figure: FigureCreate) => FigureImp<A, S> {
    class Custom extends FigureImp<A, S> {
      checkEventOnImp (coordinate: Coordinate, attrs: A, styles: S): boolean {
        return figure.checkEventOn(coordinate, attrs, styles)
      }

      drawImp (ctx: CanvasRenderingContext2D, attrs: A, styles: S): void {
        figure.draw(ctx, attrs, styles)
      }
    }
    return Custom
  }
}
