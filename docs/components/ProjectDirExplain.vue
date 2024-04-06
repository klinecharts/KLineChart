<script setup>
import { ref } from 'vue'

import { useData } from 'vitepress'

const { lang } = useData()

const isCN = lang.value === 'zh-CN'

const dirs = ref([
  { name: 'dist', explain: isCN ? '存放编译生成的文件' : 'Store compiled files' },
  { name: 'docs', explain: isCN ? '文档目录' : 'Docs directory' },
  { name: 'scripts', explain: isCN ? '构建的脚本目录' : 'Built script directory' },
  {
    name: 'src',
    explain: isCN ? '源码目录' : 'Source code directory',
    children: [
      {
        name: 'common',
        explain: isCN ? '存放公共的基础的一些文件' : 'Store some public basic files',
        children: [
          { name: 'utils', explain: isCN ? '工具类文件夹' : 'Util directory', },
        ]
      },
      { name: 'component', explain: isCN ? '组件文件夹' : 'Component directory' },
      {
        name: 'extension',
        explain: isCN ? '可扩展的一些模块文件夹' : 'Some module directory that can be extended',
        children: [
          { name: 'figure', explain: isCN ? '基础图形文件夹' : 'Basic drawing directory' },
          { name: 'i18n', explain: isCN ? '国际化文件夹' : 'International directory' },
          { name: 'indicator', explain: isCN ? '指标文件夹' : 'Indicator directory' },
          { name: 'overlay', explain: isCN ? '覆盖物文件夹' : 'Overlay directory' },
          { name: 'styles', explain: isCN ? '样式文件夹' : 'Style directory' },
          { name: 'x-axis', explain: isCN ? 'x轴文件夹' : 'X-axis directory' },
          { name: 'y-axis', explain: isCN ? 'y轴文件夹' : 'Y-axis directory' }
        ]
      },
      { name: 'pane', explain: isCN ? '窗口文件夹' : 'Panel directory' },
      { name: 'store', explain: isCN ? '数据存储文件夹' : 'Data store directory' },
      { name: 'view', explain: isCN ? '绘制模块文件夹' : 'Draw module directory' },
      { name: 'widget', explain: isCN ? '绘制模块集合文件夹' : 'Draw module collection directory' },
    ]
  },
  { name: 'tests', explain: isCN ? '测试模块文件夹' : 'Test module directory' }
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
        <span class="explain">//&nbsp;&nbsp;{{ item.explain }}</span>
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
            <span class="explain">//&nbsp;&nbsp;{{ child.explain }}</span>
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
                <span class="explain">//&nbsp;&nbsp;{{ grandson.explain }}</span>
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

