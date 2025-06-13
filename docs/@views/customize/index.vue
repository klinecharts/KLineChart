<template>
  <div class="customize">
    <h1 class="customize-title">{{i18n('view_customize_title', lang)}}</h1>
    <div class="customize-content">
      <div class="customize-content-item customize-content-free-item">
        <div class="customize-content-item-title-container">
          <h3 class="customize-content-item-title">{{i18n('view_customize_free_title', lang)}}</h3>
          <p class="customize-content-item-sub-title">{{i18n('view_customize_free_desc', lang)}}</p>
          <p class="customize-content-item-price">
            {{i18n('view_customize_free_price', lang)}}
          </p>
        </div>
        <FeatureList :features="i18n('view_customize_free_features', lang)"/>
        <p class="customize-content-item-tip">
          {{i18n('view_customize_free_tip', lang)}}
        </p>
      </div>
      <div class="customize-content-item customize-content-qa-item">
        <div class="customize-content-item-title-container">
          <h3 class="customize-content-item-title">{{i18n('view_customize_sponsor_title', lang)}}</h3>
            <p class="customize-content-item-sub-title">{{i18n('view_customize_sponsor_desc', lang)}}</p>
            <p class="customize-content-item-price">
              <span style="font-size: 14px; padding-right: 6px; padding-top: 4px; font-weight: normal;">{{i18n('view_customize_sponsor_sponsor', lang)}}</span>
              {{i18n('view_customize_sponsor_price', lang)}}
            </p>
        </div>
        
        <FeatureList :features="i18n('view_customize_sponsor_features', lang)"/>
        <p class="customize-content-item-tip">
          {{i18n('view_customize_sponsor_tip', lang)}}
        </p>
      </div>
      <div class="customize-content-item customize-content-custom-item">
        <div class="customize-content-item-title-container">
          <h3 class="customize-content-item-title">{{i18n('view_customize_custom_title', lang)}}</h3>
          <p class="customize-content-item-sub-title">{{i18n('view_customize_custom_desc', lang)}}</p>
          <p class="customize-content-item-price">
            {{i18n('view_customize_custom_price', lang)}}
          </p>
        </div>
        <FeatureList :features="i18n('view_customize_custom_features', lang)"/>
        <p class="customize-content-item-tip">
          {{i18n('view_customize_custom_tip', lang)}}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'

import i18n from '../../@i18n'

import FeatureList from './FeatureList.vue'

const { lang } = useData()

</script>
<style scoped>

.customize {
  padding-top: 80px;
  box-sizing: border-box;
}

.customize-title {
  font-size: 46px;
  text-align: center;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 4px;
  color: transparent;
  background-image: linear-gradient(to right, var(--vp-c-indigo-1), var(--vp-c-text-1));
  background-clip: text;
  padding-bottom: 50px;
}

.customize-content {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 40px 80px 40px;
}

.customize-content-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 26%;
  border-top: solid 4px;
  border-left: solid 1px transparent;
  border-right: solid 1px transparent;
  border-bottom: solid 1px transparent;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  transform: scale(1);
  transform-origin: center bottom;
  transition: all 0.25s ease-in-out;
  cursor: pointer;
  max-width: 400px;
  box-sizing: border-box;
  min-height: 500px;
}

.customize-content-item:hover {
  transform: scale(1.02);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

.customize-content-free-item {
  border-top-color: var(--custom-green);
}

.customize-content-free-item:hover {
  border-left-color: var(--custom-green);
  border-right-color: var(--custom-green);
  border-bottom-color: var(--custom-green);
  background-color: rgba(45, 192, 142, 0.05);
}

.customize-content-qa-item {
  border-top-color: var(--vp-c-indigo-1);
}

.customize-content-qa-item:hover {
  border-left-color: var(--vp-c-indigo-1);
  border-right-color: var(--vp-c-indigo-1);
  border-bottom-color: var(--vp-c-indigo-1);
  background-color: rgba(22, 119, 255, 0.05);
}

.customize-content-custom-item {
  border-top-color: var(--custom-red);
}

.customize-content-custom-item:hover {
  border-left-color: var(--custom-red);
  border-right-color: var(--custom-red);
  border-bottom-color: var(--custom-red);
  background-color: rgba(249, 40, 85, 0.05);
}

.customize-content-item-title-container {
  width: 100%;
  padding: 30px 20px;
  height: 164px;
  border-bottom: solid 1px var(--vp-c-gutter);
}

.customize-content-item-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
  line-height: normal;
}

.customize-content-item-sub-title {
  font-size: 14px;
  text-align: center;
  padding-top: 2px;
  color: var(--vp-c-text-2);
}

.customize-content-item-price {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  padding-top: 22px;
}

.customize-content-item-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100px;
  font-size: 14px;
  padding: 0 20px;
  color: #e77c0a;
  line-height: 18px;
  border-top: solid 1px var(--vp-c-gutter);
}

.customize-content-item-link {
  white-space: nowrap;
  color: var(--vp-c-indigo-1);
  text-decoration: underline;
}

@media (max-width: 960px) {
  .customize-content {
    padding-left: 60px;
    padding-right: 60px;
  }

  .customize-content {
    flex-direction: column;
  }
  .customize-content-item {
    width: 100%;
    max-width: inherit;
  }
}

@media (max-width: 768px) {
  .customize {
    padding-top: 50px;
  }
  .customize-title {
    padding-bottom: 40px;
  }
  .customize-content {
    padding-left: 20px;
    padding-right: 20px;
  }
}

</style>