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

import TypeOrNull from '../../common/TypeOrNull'

import FigureTemplate, { Figure, FigureConstructor } from '../../componentl/Figure'

import circle from './circle'
import line from './line'
import polygon from './polygon'
import rect from './rect'
import text from './text'

const figures: { [key: string]: FigureConstructor } = {}

const templates = [circle, line, polygon, rect, text]
templates.forEach((template: Figure) => {
  figures[template.name] = FigureTemplate.extend(template)
})

function getSupportFigures (): string[] {
  return Object.keys(figures)
}

function reisterFigure<A = any> (figure: Figure<A>): void {
  figures[figure.name] = FigureTemplate.extend(figure)
}

function getFigureClass<A = any> (name: string): TypeOrNull<FigureConstructor<A>> {
  return figures[name] ?? null
}

function createFigure<A = any> (name: string, attrs: A): TypeOrNull<FigureTemplate<A>> {
  const FigureClazz = getFigureClass<A>(name)
  if (FigureClazz !== null) {
    return new FigureClazz(attrs)
  }
  return null
}

export { getSupportFigures, getFigureClass, reisterFigure, createFigure }
