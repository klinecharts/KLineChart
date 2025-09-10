<script setup>
import { computed } from 'vue'

const props = defineProps({
  className: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    require: true
  },
  disableAnimation: {
    type: Boolean,
    default: false
  }
})

const rootClass = computed(() => {
  return props.className ? `drop-text ${props.className}` : 'drop-text'
})

const charClass = computed(() => {
  return props.disableAnimation ? `char disableAnimation` : 'char'
})

const words = computed(() => {
  return props.text.split(/(\s+)/)
})

const animateDelay = computed(() => {
  return 1.8 / props.text.length
})

function getCharAnimDelay (currentWordIndex, currentCharIndex) {
  let delay = 0
  for (let i = 0; i < currentWordIndex; i++) {
    const word = words.value[i]
    delay += (word.length * animateDelay.value)
  }
  delay += (currentCharIndex * animateDelay.value)
  return delay
}

</script>

<template>
  <div
    :class="rootClass"
    :style="{ '--drop-text-anim-duration': `${animateDelay * 2}s` }">
    <span class="word" :class="{ 'wrap-word': words.length === 1 }" v-for="(word, wordIndex) in words" :key="`word-${wordIndex}`">
      <span
        v-for="(char, charIndex) in Array.from(word)"
        :class="charClass"
        :key="`char-${wordIndex}-${charIndex}`"
        :style="{ '--drop-text-anim-delay': `${getCharAnimDelay(wordIndex, charIndex)}s` }"
      >
        {{ char }}
      </span>
    </span>
  </div>
</template>

<style scoped>
.drop-text {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  white-space: pre-wrap;
  color: var(--vp-c-text-1)
}

.word {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.wrap-word {
  flex-wrap: wrap;
  justify-content: center;
}

.char {
  opacity: 0;
  animation: show var(--drop-text-anim-duration) ease-out var(--drop-text-anim-delay) forwards;
}

.char.disableAnimation {
  opacity: 1;
  animation: none;
}

@keyframes show {
  0% {
    filter: blur(8px);
    transform: translateY(-60px) rotate(-60deg);
    opacity: 0;
  }
  100% {
    filter: blur(0);
    transform: translateY(0) rotate(0);
    opacity: 1;
  }
}

</style>