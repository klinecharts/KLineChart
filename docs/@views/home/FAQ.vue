<script setup>
import { ref, watch } from 'vue'
import { useData } from 'vitepress';

import Section from './Section.vue';

const { lang } = useData()

const zhItems = [
  {
    q: "初始化图表后，只能看到一个x轴，是怎么回事？",
    a: "图表总是会填充容器，检查一下容器是否有高度。",
    collapsed: true
  },
  {
    q: "蜡烛柱显示趋近于一条线，看不到波动，怎么办？",
    a: `图表默认价格精度为两位小数，调用 <code>setPriceVolumePrecision(pricePrecision, volumePrecision)</code> 设置下精度。`,
    collapsed: true
  },
  {
    q: "分时图怎么创建？",
    a: `通过样式设置，<code>chart.setStyles({ candle: { type: 'area' }})</code> 。`,
    collapsed: true
  },
  {
    q: "内置的技术指标，计算出来的数据不是想要的，怎么办？",
    a: `可以通过图表方法 <code>createIndicator</code> 或者 <code>overrideIndicator</code> 重写 <code>calc</code> 即可。`,
    collapsed: true
  },
  {
    q: "想创建一个内置技术指标之外的指标，怎么办？",
    a: `图表支持自定义技术指标，详情参阅<a rel="noreferrer" href="/guide/indicator" style="cursor:pointer;color:var(--vp-c-indigo-1)">技术指标</a>。`,
    collapsed: true
  },
  {
    q: "想标记一下买卖点，该怎么做？",
    a: `可以使用覆盖物，内置的覆盖物有一个 <code>simpleAnnotation</code> ，用图表api创建即可 <code>createOverlay({ name: 'simpleAnnotation', ... }, paneId)</code> 。`,
    collapsed: true
  },
]

const enItems = [
  {
    q: "After the chart is initialized, only one line can be seen?",
    a: "The chart always fills the container, checking to see if the container has height.",
    collapsed: true
  },
  {
    q: "The candle shows a line, no fluctuation, what to do?",
    a: `Chart default price precision is two decimal, call <code>setPriceVolumePrecision(pricePrecision, volumePrecision)</code> to set the precision.`,
    collapsed: true
  },
  {
    q: "How to create a real-time chart?",
    a: `Through style settings, <code>chart.setStyles({ candle: { type: 'area' }})</code> 。`,
    collapsed: true
  },
  {
    q: "Built-in technical indicators, calculated data is not what you want, how to do?",
    a: `You can override <code>calc</code> by the chart method <code>createIndicator</code> or <code>overrideIndicator</code>.`,
    collapsed: true
  },
  {
    q: "What if I want to create an indicator other than the built-in technical indicator?",
    a: `Chart support custom technical indicators, see <a rel="noreferrer" href="/en-US/guide/indicator" style="cursor:pointer;color:var(--vp-c-indigo-1)">indicators</a> for details.`,
    collapsed: true
  },
  {
    q: "Want to mark the point of sale, how should do?",
    a: `Overlays can be used. The built-in overlay has a <code>simpleAnnotation</code>, which can be created with the chart api <code>createOverlay({ name: 'simpleAnnotation', ... }, paneId)</code>.`,
    collapsed: true
  },
]

const items = ref(lang.value === 'zh-CN' ? zhItems : enItems)
watch(lang, (newLang) => {
  items.value = newLang === 'zh-CN' ? zhItems : enItems
})

</script>

<template>
  <Section
    title="FAQ"
    :subTitle="lang === 'zh-CN' ? '开发过程遇到的问题，大多都可以从以下内容中找到答案。' : 'Most of the problems encountered during the development process can be answered from the following content.'">
    <ul class="faq">
      <li class="item" v-for="item in items">
        <div class="item-content home-faq-item-content">
          <span class="item-content-q">{{ item.q }}</span>
          <span v-if="!item.collapsed" class="item-content-a" v-html="item.a"/>
        </div>
        <span
          class="icon"
          @click="item.collapsed = !item.collapsed">
          <svg
            v-if="item.collapsed"
            viewBox="0 0 30 30">
            <g transform="translate(-1630, -2301)">
              <path d="M1647,2301 L1647,2314 L1660,2314 L1660,2318 L1646.999,2318 L1647,2331 L1643,2331 L1642.999,2318 L1630,2318 L1630,2314 L1643,2314 L1643,2301 L1647,2301 Z"/>
            </g>
          </svg>
          <svg
            v-if="!item.collapsed"
            viewBox="0 0 30 4">
            <g transform="translate(-1630, -2444)">
              <rect x="1630" y="2444" width="30" height="4"/>
            </g>
          </svg>
        </span>
      </li>
    </ul>
  </Section>
</template>

<style>
.home-faq-item-content code {
  padding: 2px 6px;
  border-radius: 4px;
  background-color:var(--vp-code-bg);
  color:var(--vp-code-color);
}
</style>

<style scoped>
.faq {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.item {
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: var(--vp-c-bg-soft);
  padding: 16px 26px;
  border-radius: 8px;
  color: var(--vp-c-text-1);
}

.item-content {
  display: flex;
  flex-direction: column;
  margin-right: auto;
  padding-right: 16px;
}

.item-content-q {
  font-size: 16px;
  line-height: 22px;
}

.item-content-a {
  font-size: 14px;
  padding-top: 12px;
  color: var(--vp-c-text-2);
}

.icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 16px;
  height: 22px;
  cursor: pointer;
}

.icon svg {
  width: 16px;
  fill: var(--vp-c-text-1);
}

@media (min-width: 640px) {
  .faq {
    gap: 20px;
  }
  .item {
    padding: 18px 50px;
  }
  .item-content-q {
    font-size: 18px;
    line-height: 28px;
  }

  .item-content-a {
    font-size: 16px;
    padding-top: 20px;
  }
  .icon {
    width: 20px;
    height: 28px;
  }

  .icon svg {
    width: 20px;
  }
}
</style>