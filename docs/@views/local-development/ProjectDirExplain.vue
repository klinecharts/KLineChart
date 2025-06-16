<script setup>
import { ref } from 'vue'

import { useData } from 'vitepress'

import i18n from '../../@i18n'

const { lang } = useData()

const dirs = ref([
  { name: 'dist', explain: 'view_local_dev_dir_explain_dist' },
  { name: 'docs', explain: 'view_local_dev_dir_explain_docs' },
  { name: 'scripts', explain: 'view_local_dev_dir_explain_scripts' },
  {
    name: 'src',
    explain: 'view_local_dev_dir_explain_src',
    children: [
      {
        name: 'common',
        explain: 'view_local_dev_dir_explain_common',
        children: [
          { name: 'utils', explain: 'view_local_dev_dir_explain_utils', },
        ]
      },
      { name: 'component', explain: 'view_local_dev_dir_explain_component' },
      {
        name: 'extension',
        explain: 'view_local_dev_dir_explain_extension',
        children: [
          { name: 'figure', explain: 'view_local_dev_dir_explain_figure' },
          { name: 'i18n', explain: 'view_local_dev_dir_explain_i18n' },
          { name: 'indicator', explain: 'view_local_dev_dir_explain_indicator' },
          { name: 'overlay', explain: 'view_local_dev_dir_explain_overlay' },
          { name: 'styles', explain: 'view_local_dev_dir_explain_styles' },
          { name: 'x-axis', explain: 'view_local_dev_dir_explain_x_axis' },
          { name: 'y-axis', explain: 'view_local_dev_dir_explain_y_axis' }
        ]
      },
      { name: 'pane', explain: 'view_local_dev_dir_explain_pane' },
      { name: 'view', explain: 'view_local_dev_dir_explain_view' },
      { name: 'widget', explain: 'view_local_dev_dir_explain_widget' },
    ]
  },
  { name: 'tests', explain: 'view_local_dev_dir_explain_tests' }
])
</script>

<template>
  <ul class="project-dir-explain" style="margin-top: 20px;">
    <li class="item" v-for="(item, index) of dirs">
      <div class="row" :class="{ 'not-border': index === dirs.length - 1 }">
        <div style="display: flex;align-items: center;padding-left: 18px;width: 200px;">
          <svg viewBox="0 0 1024 1024" width="14" height="14">
            <path d="M153.856 154.112H153.6a51.2 51.2 0 0 0-51.2 51.2V819.2a51.2 51.2 0 0 0 51.2 51.2h716.8a51.2 51.2 0 0 0 51.2-51.2V307.4048a51.2 51.2 0 0 0-51.4048-50.9952l-336.6912 1.3312a102.4 102.4 0 0 1-72.8064-30.0032L403.1488 170.1888a51.2 51.2 0 0 0-35.9424-15.0016l-213.3504-1.024z m0.256-51.2l213.4016 1.0752a102.4 102.4 0 0 1 71.8848 30.0032l57.4976 57.5488a51.2 51.2 0 0 0 36.4544 15.0016l336.64-1.3312A102.4 102.4 0 0 1 972.8 307.2v512a102.4 102.4 0 0 1-102.4 102.4H153.6a102.4 102.4 0 0 1-102.4-102.4V205.312a102.4 102.4 0 0 1 102.4-102.4h0.512z"/>
          </svg>
          <span>{{ item.name }}</span>
        </div>
        <span class="explain">//&nbsp;&nbsp;{{ i18n(item.explain, lang) }}</span>
      </div>
      <ul v-if="item.children" class="project-dir-explain project-dir-explain-child">
        <li v-for="child of item.children" class="item">
          <div class="row">
            <div style="display: flex;align-items: center;padding-left: 40px;width: 200px;">
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path d="M153.856 154.112H153.6a51.2 51.2 0 0 0-51.2 51.2V819.2a51.2 51.2 0 0 0 51.2 51.2h716.8a51.2 51.2 0 0 0 51.2-51.2V307.4048a51.2 51.2 0 0 0-51.4048-50.9952l-336.6912 1.3312a102.4 102.4 0 0 1-72.8064-30.0032L403.1488 170.1888a51.2 51.2 0 0 0-35.9424-15.0016l-213.3504-1.024z m0.256-51.2l213.4016 1.0752a102.4 102.4 0 0 1 71.8848 30.0032l57.4976 57.5488a51.2 51.2 0 0 0 36.4544 15.0016l336.64-1.3312A102.4 102.4 0 0 1 972.8 307.2v512a102.4 102.4 0 0 1-102.4 102.4H153.6a102.4 102.4 0 0 1-102.4-102.4V205.312a102.4 102.4 0 0 1 102.4-102.4h0.512z"/>
              </svg>
              <span>{{ child.name }}</span>
            </div>
            <span class="explain">//&nbsp;&nbsp;{{ i18n(child.explain, lang) }}</span>
          </div>
          <ul v-if="child.children" class="project-dir-explain project-dir-explain-child">
            <li v-for="grandson of child.children" class="item">
              <div class="row">
                <div style="display: flex;align-items: center;padding-left: 62px;width: 200px;">
                  <svg viewBox="0 0 1024 1024" width="14" height="14">
                    <path d="M153.856 154.112H153.6a51.2 51.2 0 0 0-51.2 51.2V819.2a51.2 51.2 0 0 0 51.2 51.2h716.8a51.2 51.2 0 0 0 51.2-51.2V307.4048a51.2 51.2 0 0 0-51.4048-50.9952l-336.6912 1.3312a102.4 102.4 0 0 1-72.8064-30.0032L403.1488 170.1888a51.2 51.2 0 0 0-35.9424-15.0016l-213.3504-1.024z m0.256-51.2l213.4016 1.0752a102.4 102.4 0 0 1 71.8848 30.0032l57.4976 57.5488a51.2 51.2 0 0 0 36.4544 15.0016l336.64-1.3312A102.4 102.4 0 0 1 972.8 307.2v512a102.4 102.4 0 0 1-102.4 102.4H153.6a102.4 102.4 0 0 1-102.4-102.4V205.312a102.4 102.4 0 0 1 102.4-102.4h0.512z"/>
                  </svg>
                  <span>{{ grandson.name }}</span>
                </div>
                <span class="explain">//&nbsp;&nbsp;{{ i18n(grandson.explain, lang) }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>
.project-dir-explain {
  border: solid var(--vp-c-border) 1px;
  border-radius: 8px;
  list-style: none;
  padding: 0;
  margin: 0
}

.project-dir-explain-child {
  border-radius: 0;
  border: none;
}

.project-dir-explain .item {
  margin: 0;
  box-sizing: border-box;
}

.project-dir-explain .item .row {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  fill: var(--vp-c-text-2);
  padding-right: 18px;
  border-bottom: solid var(--vp-c-border) 1px;
}

.project-dir-explain .item .row.not-border {
  border-bottom: none
}

.project-dir-explain .item .row svg {
  fill: var(--vp-c-text-2);
  margin-right: 8px;
}

.project-dir-explain .item .row .explain {
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
</style>

