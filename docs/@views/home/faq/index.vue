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
      <li class="item" v-for="item in items" :key="item.q">
        <div class="item-content home-faq-item-content">
          <span class="item-content-q">{{ i18n(item.q, lang) }}</span>
          <SmoothExpand :expanded="item.expanded">
            <span class="item-content-a" v-html="i18n(item.a, lang)"/>
          </SmoothExpand>
        </div>
        <span
          class="icon"
          @click="item.expanded = !item.expanded">
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1px;
  /* background-color: var(--vp-c-gutter); */
}

.item {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 16px 0px;
  color: var(--vp-c-text-1);
  overflow: hidden;
  border-bottom: solid 1px var(--vp-c-gutter);
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
}

.item-content-a-wrapper {
  overflow: hidden;
}

.item-content-a {
  display: block;
  font-size: 14px;
  padding-top: 12px;
  color: var(--vp-c-text-2);
  word-break: break-word;
}

.icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 22px;
  cursor: pointer;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .item {
    padding: 20px 0;
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
}
</style>