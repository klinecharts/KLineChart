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

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
export function merge (target: any, source: any): void {
  if ((!isObject(target) && !isObject(source))) {
    return
  }
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key) as boolean) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- ignore
      const targetProp = target[key]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- ignore
      const sourceProp = source[key]
      if (
        isObject(sourceProp) &&
        isObject(targetProp)
      ) {
        merge(targetProp, sourceProp)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ignore
        if (isValid(source[key])) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- ignore
          target[key] = clone(source[key])
        }
      }
    }
  }
}

export function clone<T> (target: T): T {
  if (!isObject(target)) {
    return target
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
  let copy: any = null
  if (isArray(target)) {
    copy = []
  } else {
    copy = {}
  }
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key) as boolean) {
      const v = target[key]
      if (isObject(v)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ignore
        copy[key] = clone(v)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- ignore
        copy[key] = v
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- ignore
  return copy
}

export function isArray<T = unknown> (value: unknown): value is T[] {
  return Object.prototype.toString.call(value) === '[object Array]'
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- ignore
export function isFunction<T = (...args: unknown[]) => unknown> (value: unknown): value is T {
  return typeof value === 'function'
}

export function isObject (value: unknown): value is object {
  return (typeof value === 'object') && isValid(value)
}

export function isNumber (value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isValid<T> (value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function isBoolean (value: unknown): value is boolean {
  return typeof value === 'boolean'
}

export function isString (value: unknown): value is string {
  return typeof value === 'string'
}
