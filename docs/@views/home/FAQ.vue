<script setup>
import { ref, watch } from 'vue'
import { useData } from 'vitepress'
import i18n from '../../@i18n'

import Section from './Section.vue'

const { lang } = useData()

const items = ref([
  {
    q: "view_home_faq_question_1",
    a: "view_home_faq_answer_1",
    collapsed: true
  },
  {
    q: "view_home_faq_question_2",
    a: "view_home_faq_answer_2",
    collapsed: true
  },
  {
    q: "view_home_faq_question_3",
    a: "view_home_faq_answer_3",
    collapsed: true
  },
  {
    q: "view_home_faq_question_4",
    a: "view_home_faq_answer_4",
    collapsed: true
  },
  {
    q: "view_home_faq_question_5",
    a: "view_home_faq_answer_5",
    collapsed: true
  },
  {
    q: "view_home_faq_question_6",
    a: "view_home_faq_answer_6",
    collapsed: true
  },
])

</script>

<template>
  <Section
    :title="i18n('view_home_faq_title', lang)"
    :description="i18n('view_home_faq_desc', lang)">
    <ul class="faq">
      <li class="item" v-for="item in items">
        <div class="item-content home-faq-item-content">
          <span class="item-content-q">{{ i18n(item.q, lang) }}</span>
          <span v-if="!item.collapsed" class="item-content-a" v-html="i18n(item.a, lang)"/>
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
  word-break: break-word;
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