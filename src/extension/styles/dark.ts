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

import type DeepPartial from '../../common/DeepPartial'
import { type Styles } from '../../common/Styles'

const dark: DeepPartial<Styles> = {
  grid: {
    horizontal: {
      color: '#292929'
    },
    vertical: {
      color: '#292929'
    }
  },
  candle: {
    priceMark: {
      high: {
        color: '#929AA5'
      },
      low: {
        color: '#929AA5'
      }
    },
    tooltip: {
      rect: {
        color: 'rgba(10, 10, 10, .6)',
        borderColor: 'rgba(10, 10, 10, .6)'
      },
      text: {
        color: '#929AA5'
      }
    }
  },
  indicator: {
    tooltip: {
      text: {
        color: '#929AA5'
      }
    }
  },
  xAxis: {
    axisLine: {
      color: '#333333'
    },
    tickText: {
      color: '#929AA5'
    },
    tickLine: {
      color: '#333333'
    }
  },
  yAxis: {
    axisLine: {
      color: '#333333'
    },
    tickText: {
      color: '#929AA5'
    },
    tickLine: {
      color: '#333333'
    }
  },
  separator: {
    color: '#333333'
  },
  crosshair: {
    horizontal: {
      line: {
        color: '#929AA5'
      },
      text: {
        borderColor: '#373a40',
        backgroundColor: '#373a40'
      }
    },
    vertical: {
      line: {
        color: '#929AA5'
      },
      text: {
        borderColor: '#373a40',
        backgroundColor: '#373a40'
      }
    }
  }
}

export default dark
