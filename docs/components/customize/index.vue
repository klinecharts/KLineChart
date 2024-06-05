<template>
  <div class="customize">
    <h1 class="customize-title">{{ lang === 'zh-CN' ? '定制化服务' : 'Customized Service' }}</h1>
    <div class="customize-content">
      <div class="customize-content-item customize-content-free-item">
        <div class="customize-content-item-title-container">
          <h3 class="customize-content-item-title">{{ lang === 'zh-CN' ? '免费版' : 'Free' }}</h3>
          <p class="customize-content-item-sub-title">{{ lang === 'zh-CN' ? '免费的专业级K线组件' : 'Free professional K Line component' }}</p>
          <p class="customize-content-item-price">
            {{ lang === 'zh-CN' ? '¥ 0' : '$ 0' }}
          </p>
        </div>
        <FeatureList :features="lang === 'zh-CN' ? ['高度可扩展的核心图表', '功能完善的Pro版图表', '完善的开发文档', '开发讨论微信群'] : ['Highly scalable core chart', 'Full features Pro version chart', 'Complete development documents', 'Development discussion WeChat group']"/>
        <p class="customize-content-item-tip">
          {{ lang === 'zh-CN' ? '联系开发者加入开发讨论群。' : 'Contact the developer to join the development discussion group.' }}
        </p>
      </div>
      <div class="customize-content-item customize-content-qa-item">
        <div class="customize-content-item-title-container">
          <h3 class="customize-content-item-title">{{ lang === 'zh-CN' ? '赞助版' : 'Sponsor' }}</h3>
            <p class="customize-content-item-sub-title">{{ lang === 'zh-CN' ? '全方位解答遇到的问题' : 'Comprehensive answers to development issues' }}</p>
            <p class="customize-content-item-price">
              <span style="font-size: 14px; padding-right: 6px; padding-top: 4px; font-weight: normal;">{{ lang === 'zh-CN' ? '赞助' : 'Sponsor' }}</span>{{ lang === 'zh-CN' ? `¥ 500` : '$ 78' }}
            </p>
        </div>
        
        <FeatureList :features="lang === 'zh-CN' ? ['免费版所有服务', '更多的示例代码', '首页赞助商广告位', '专属答疑微信群'] : ['All services in the free version', 'More sample codes', 'Homepage sponsor advertising space', 'Exclusive Q&A WeChat group']"/>
        <p class="customize-content-item-tip">
          {{ lang === 'zh-CN' ? '在赞助页对项目进行捐赠，完成之后联系开发者加入专属答疑群。' : 'Sponsor to the project on the sponsorship page, and after completion, contact the developer to join the exclusive Q&A group.' }}
        </p>
      </div>
      <div class="customize-content-item customize-content-custom-item">
        <div class="customize-content-item-title-container">
          <h3 class="customize-content-item-title">{{ lang === 'zh-CN' ? '定制版' : 'Customized' }}</h3>
          <p class="customize-content-item-sub-title">{{ lang === 'zh-CN' ? '专属定制，扩展开发' : 'Exclusive customization and extended development' }}</p>
          <p class="customize-content-item-price">
            {{ lang === 'zh-CN' ? '¥ 面议' : '$ Discussion' }}
          </p>
        </div>
        <FeatureList :features="lang === 'zh-CN' ? ['赞助版所有服务', 'UI定制开发', '扩展定制开发', '其它图表相关定制开发'] : ['All services of the sponsored version', 'UI custom development', 'Extended custom development', 'Other chart custom development']"/>
        <p class="customize-content-item-tip">
          {{ lang === 'zh-CN' ? '联系开发者，讨论具体需求。' : 'Contact developers to discuss specific requirements.' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'

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