<template>
  <a
    ref="buttonRef"
    :href="repoUrl"
    target="_blank"
    rel="noopener noreferrer"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- GitHub Icon -->
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" class="github-icon">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
    
    <span>GitHub</span>
    
    <Particle v-if="!isLoading" ref="particle">
      <svg
        aria-hidden="true"
        class="star star-bg"
        viewBox="0 0 16 16">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
      </svg>
      <!-- Filled Star with Dynamic Clip Path -->
      <svg
        aria-hidden="true"
        class="star star-filled"
        viewBox="0 0 16 16"
        :style="{
          clipPath: `inset(${100 - fillPercentage}% 0 0 0)`
        }">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
      </svg>
    </Particle>

    <!-- Number Display -->
    <span v-if="!isLoading" class="number-container">
      
      <!-- Animated Numbers -->
      <span class="number-animated">
        <template v-for="(segment, index) in formattedResult.number" :key="`animated-${index}`">
          <span
            v-for="(digit, digitIndex) in segment.split('')"
            :key="`animated-${index}-${digitIndex}`"
            class="sliding-number"
          >
            {{ digit }}
          </span>
        </template>
        <span v-if="formatted && formattedResult.unit">
          {{ formattedResult.unit }}
        </span>
      </span>
    </span>
  </a>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

import Particle from '../../../@components/Particle.vue'

// Props
const props = defineProps({
  username: {
    type: String,
    required: true
  },
  repo: {
    type: String,
    required: true
  },
  formatted: {
    type: Boolean,
    default: false
  },
  inView: {
    type: Boolean,
    default: false
  },
  inViewOnce: {
    type: Boolean,
    default: true
  },
  inViewMargin: {
    type: String,
    default: '0px'
  },
  className: {
    type: String,
    default: ''
  }
})

const particle = ref(null)

// Reactive data
const stars = ref(0)
const currentNumber = ref(0)
const isLoading = ref(true)
const isCompleted = ref(false)
const buttonRef = ref(null)
const isInView = ref(false)

// Computed properties
const repoUrl = computed(() => `https://github.com/${props.username}/${props.repo}`)

const fillPercentage = computed(() => {
  return Math.min(100, (currentNumber.value / stars.value) * 100)
})

const formattedResult = computed(() => {
  return formatNumber(currentNumber.value, props.formatted)
})

const buttonClasses = computed(() => {
  return `github-button ${props.className}`
})

// Utility functions
function formatNumber(num, formatted) {
  const value = `${num}`
  if (formatted) {
    const result = value.replace(/(\d)(?=(\d{3})+$)/g, $1 => `${$1},`)
    const splitArray = result.split(',')
    const numSegments = [splitArray[0]]
    for (let i = 1; i < splitArray.length; i++) {
      numSegments.push(',')
      numSegments.push(splitArray[i])
    }
    return { number: numSegments, unit: '' }
  }
  return { number: value, unit: '' }
}

// Animation function
function animateToValue(target) {
  if (currentNumber.value >= target) return
  
  const duration = 2000
  const startValue = currentNumber.value
  const difference = target - startValue
  const startTime = Date.now()
  
  function updateValue() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function (ease out cubic)
    const easedProgress = 1 - Math.pow(1 - progress, 3)
    
    currentNumber.value = Math.round(startValue + (difference * easedProgress))
    
    if (progress < 1) {
      requestAnimationFrame(updateValue)
    } else {
      currentNumber.value = target
      if (!isCompleted.value) {
        isCompleted.value = true
        showParticle()
      }
    }
  }
  
  updateValue()
}

// Event handlers
function showParticle() {
  if (particle.value && particle.value.start) {
    particle.value.start()
  }
}

function handleClick(e) {
  e.preventDefault()
  showParticle()
  setTimeout(() => {
    window.open(repoUrl.value, '_blank')
  }, 500)
}

// Setup intersection observer for inView functionality
function setupIntersectionObserver() {
  if (!props.inView) {
    isInView.value = true
    return
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isInView.value = true
          if (props.inViewOnce) {
            observer.disconnect()
          }
        } else if (!props.inViewOnce) {
          isInView.value = false
        }
      })
    },
    {
      rootMargin: props.inViewMargin
    }
  )
  
  if (buttonRef.value) {
    observer.observe(buttonRef.value)
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Fetch GitHub stars
  try {
    const response = await fetch(`https://api.github.com/repos/${props.username}/${props.repo}`)
    const data = await response.json()
    if (data && typeof data.stargazers_count === 'number') {
      stars.value = data.stargazers_count
      isLoading.value = false
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error)
  }
  
  // Setup intersection observer
  await nextTick()
  setupIntersectionObserver()
})

// Watchers
watch([() => stars.value, () => isInView.value], ([newStars, newIsInView]) => {
  if (newStars > 0 && newIsInView) {
    animateToValue(newStars)
  }
})
</script>

<style scoped>
/* Button Base Styles */
.github-button {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  background-color: transparent;
  border: solid 1px var(--vp-c-border);
  color: var(--vp-c-text-1);
  border-radius: 8px;
  padding: 0 16px;
  height: 36px;
  cursor: pointer;
  text-decoration: none;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
  transition: all 0.3s ease;
  font-size: 14px;
}

.github-button:hover {
  color: var(--vp-c-indigo-1);
}

/* GitHub Icon */
.github-icon {
  width: 16px;
  height: 16px;
}

.star {
  width: 14px;
  height: 14px;
}

.star-bg {
  fill: var(--vp-c-text-2);
  color: var(--vp-c-text-2);
}

.star-filled {
  position: absolute;
  top: 0;
  left: 0;
  fill: var(--vp-c-indigo-1);
  color: var(--vp-c-indigo-1);
  transition: clip-path 0.3s ease;
}

/* Number Container */
.number-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: Helvetica, sans-serif;
}

.number-animated {
  display: flex;
  align-items: center;
  gap: 1px;
}

.sliding-number {
  display: flex;
  align-items: center;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 640px) {
  .github-button {
    height: 40px;
    font-size: 16px;
    gap: 8px;
    padding: 0 20px;
  }
  .github-icon {
    width: 18px;
    height: 18px;
  }

  .star {
    width: 16px;
    height: 16px;
  }
}
</style>