<script setup>
  import { useData } from 'vitepress'

  const { lang } = useData()
</script>

<template>
  <section class="home-section sponsor-section">
    <div class="home-section-content sponsor">
      <h2>{{ lang === 'zh-CN' ? '赞助商' : 'Sponsors' }}</h2>
      <div class="grid">
        <a class="item" href="./sponsor.html" target="_blank" rel="noreferrer">
          {{ lang === 'zh-CN' ? '成为赞助商' : 'Become a sponsor' }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .sponsor-section {
    margin-top: 100px;
  }

  .sponsor h2 {
    font-size: 24px;
    text-align: center;
    font-weight: 600;
  }

  .sponsor .grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 40px;
  }

  .sponsor .grid .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 138px;
    color: var(--vp-c-text-2)!important;
    background-color: var(--vp-c-bg-soft);
    border-radius: 4px;
    transition: background-color .2s;
    cursor: pointer;
    color: inherit;
  }

  .sponsor .grid .item .image {
    height: 34px;
  }

  .dark .sponsor .grid .item .image {
    filter: grayscale(1) invert(1);
  }

  .dark .sponsor .grid .item:hover {
    background-color: var(--vp-c-neutral);
    color: rgba(0, 0, 0, 0.6)!important;
  }

  .dark .sponsor .grid .item:hover .image {
    filter: grayscale(0) invert(0);
  }

  @media (min-width: 640px) {
    .sponsor .grid .item {
      width: calc((100% - 12px) / 3);
    }
  }

  @media (min-width: 960px) {
    .sponsor .grid .item {
      width: calc((100% - 18px) / 4);
    }
  }
</style>