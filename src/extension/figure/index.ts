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

import FigureImp, { FigureTemplate, FigureConstructor } from '../../component/Figure'

import circle from './circle'
import line from './line'
import polygon from './polygon'
import rect from './rect'
import text from './text'

const figures: { [key: string]: FigureConstructor } = {}

const extensions = [circle, line, polygon, rect, text]
extensions.forEach((figure: FigureTemplate) => {
  figures[figure.name] = FigureImp.extend(figure)
})

function getSupportFigures (): string[] {
  return Object.keys(figures)
}

function reisterFigure<A = any, S = any> (figure: FigureTemplate<A, S>): void {
  figures[figure.name] = FigureImp.extend(figure)
}

function getFigureClass<A = any, S = any> (name: string): TypeOrNull<FigureConstructor<A, S>> {
  return figures[name] ?? null
}

export { getSupportFigures, getFigureClass, reisterFigure }
