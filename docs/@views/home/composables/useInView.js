import { ref, onMounted, onUnmounted } from 'vue'

export function useInView (options = {}) {
  const target = ref(null)
  const isVisible = ref(false)
  let observer

  onMounted(() => {
    if (typeof window === 'undefined') {
      isVisible.value = true
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (options.once !== false) {
            observer?.disconnect()
          }
        } else if (options.once === false) {
          isVisible.value = false
        }
      },
      {
        rootMargin: options.rootMargin ?? '0px 0px -10% 0px',
        threshold: options.threshold ?? 0.1
      }
    )

    if (target.value) {
      observer.observe(target.value)
    }
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { target, isVisible }
}
