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

import ExcludePickPartial from '../../common/ExcludePickPartial'
import TypeOrNull from '../../common/TypeOrNull'

import AnnotationImp, { Annotation, AnnotationConstructor } from '../../componentl/Annotation'

import simple from './simple'

const annotations: { [key: string]: AnnotationConstructor } = {}

const extensions = [simple]

extensions.forEach((annotation: ExcludePickPartial<Annotation, 'name'>) => {
  annotations[annotation.name] = AnnotationImp.extend(annotation)
})

function registerAnnotation (annotation: ExcludePickPartial<Annotation, 'name'>): void {
  annotations[annotation.name] = AnnotationImp.extend(annotation)
}

function getAnnotationClass (name: string): TypeOrNull<AnnotationConstructor> {
  return annotations[name] ?? null
}

export { registerAnnotation, getAnnotationClass }
