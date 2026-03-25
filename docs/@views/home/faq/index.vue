<script setup>
import { ref } from 'vue'
import { useData } from 'vitepress'
import i18n from '../../../@i18n'

import Section from '../Section.vue'
import ExpandIcon from './ExpandIcon.vue'
import SmoothExpand from '../../../@components/SmoothExpand.vue'

const { lang } = useData()

const items = ref([
  {
    q: "view_home_faq_question_1",
    a: "view_home_faq_answer_1",
    expanded: false
  },
  {
    q: "view_home_faq_question_2",
    a: "view_home_faq_answer_2",
    expanded: false
  },
  {
    q: "view_home_faq_question_3",
    a: "view_home_faq_answer_3",
    expanded: false
  },
  {
    q: "view_home_faq_question_4",
    a: "view_home_faq_answer_4",
    expanded: false
  },
  {
    q: "view_home_faq_question_5",
    a: "view_home_faq_answer_5",
    expanded: false
  },
  {
    q: "view_home_faq_question_6",
    a: "view_home_faq_answer_6",
    expanded: false
  },
])

</script>

<template>
  <Section
    :title="i18n('view_home_faq_title', lang)"
    :description="i18n('view_home_faq_desc', lang)">
    <ul class="faq">
      <li
        class="item"
        :class="{ expanded: item.expanded }"
        v-for="item in items"
        :key="item.q"
        @click="item.expanded = !item.expanded"
      >
        <div class="item-content home-faq-item-content">
          <span class="item-content-q">{{ i18n(item.q, lang) }}</span>
          <SmoothExpand :expanded="item.expanded">
            <span class="item-content-a" v-html="i18n(item.a, lang)"/>
          </SmoothExpand>
        </div>
        <span class="icon">
          <ExpandIcon :expanded="item.expanded"/>
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
  display: grid;
  width: 100%;
  gap: 0;
}

.item {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 18px 0;
  color: var(--vp-c-text-1);
  overflow: hidden;
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-divider));
  cursor: pointer;
  transition: border-color .2s ease, color .2s ease;
}

.item:hover {
  border-bottom-color: color-mix(in srgb, var(--vp-c-brand-1) 22%, var(--vp-c-divider));
}

.item.expanded {
  border-bottom-color: color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-divider));
}

.item-content {
  display: flex;
  flex-direction: column;
  margin-right: auto;
  padding-right: 16px;
  width: 100%;
}

.item-content-q {
  font-size: 16px;
  line-height: 22px;
  font-weight: 600;
  transition: color .2s ease;
}

.item.expanded .item-content-q {
  color: var(--vp-c-text-1);
}

.item-content-a-wrapper {
  overflow: hidden;
}

.item-content-a {
  display: block;
  font-size: 14px;
  padding-top: 16px;
  color: var(--vp-c-text-2);
  word-break: break-word;
  max-width: 72ch;
}

.icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  margin-top: -2px;
  border-radius: 999px;
  color: var(--vp-c-text-2);
  transition: background-color .2s ease, color .2s ease;
}

.item:hover .icon,
.item.expanded .icon {
  color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
}

@media (min-width: 640px) {
  .item {
    padding: 22px 0;
  }
  .item-content-q {
    font-size: 18px;
    line-height: 28px;
  }

  .item-content-a {
    font-size: 16px;
    padding-top: 22px;
  }
  .icon {
    width: 32px;
    height: 32px;
  }
}
</style>
