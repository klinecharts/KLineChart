<script setup>
defineProps({
  variant: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <svg class="scene" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g v-if="variant === 1">
      <rect class="surface" x="17" y="19" width="206" height="122" rx="8" />
      <path class="divider" d="M17 40.5H223M177.5 40V141" />
      <circle class="accent-fill" cx="29" cy="30" r="3" />
      <circle class="muted-fill" cx="39" cy="30" r="3" />
      <path class="muted-stroke" d="M51 30H86" />
      <path class="grid" d="M29 59.5H166M29 81.5H166M29 103.5H166M29 125.5H166M51.5 50V132M79.5 50V132M107.5 50V132M135.5 50V132" />
      <g class="candles">
        <g class="candle up"><path d="M42 87V115" /><rect x="38.5" y="94" width="7" height="12" rx="1.5" /></g>
        <g class="candle up"><path d="M62 72V104" /><rect x="58.5" y="80" width="7" height="15" rx="1.5" /></g>
        <g class="candle down"><path d="M82 77V111" /><rect x="78.5" y="84" width="7" height="15" rx="1.5" /></g>
        <g class="candle up"><path d="M102 59V95" /><rect x="98.5" y="67" width="7" height="17" rx="1.5" /></g>
        <g class="candle down"><path d="M122 65V102" /><rect x="118.5" y="72" width="7" height="18" rx="1.5" /></g>
        <g class="candle up"><path d="M142 49V82" /><rect x="138.5" y="56" width="7" height="16" rx="1.5" /></g>
      </g>
      <path class="accent-stroke chart-line" d="M32 116C48 112 54 99 68 98C82 97 89 90 99 82C111 72 119 80 130 69C141 57 149 62 165 48" />
      <rect class="soft-fill" x="187" y="53" width="25" height="5" rx="2.5" />
      <rect class="soft-fill" x="187" y="68" width="18" height="5" rx="2.5" />
      <rect class="soft-fill" x="187" y="83" width="23" height="5" rx="2.5" />
      <rect class="soft-fill" x="187" y="98" width="14" height="5" rx="2.5" />
      <rect class="accent-fill" x="187" y="118" width="25" height="8" rx="4" />
    </g>

    <g v-else-if="variant === 2">
      <rect class="surface" x="79" y="12" width="82" height="136" rx="17" />
      <rect class="inner-surface" x="86" y="24" width="68" height="111" rx="12" />
      <path class="muted-stroke" d="M108 19H132" />
      <circle class="soft-fill" cx="120" cy="141" r="4" />
      <rect class="accent-soft" x="95" y="34" width="30" height="7" rx="3.5" />
      <path class="grid" d="M96 60.5H144M96 78.5H144M96 96.5H144M108.5 50V105M126.5 50V105" />
      <g class="candles small">
        <g class="candle down"><path d="M102 76V95" /><rect x="99" y="80" width="6" height="8" rx="1.5" /></g>
        <g class="candle up"><path d="M113 67V87" /><rect x="110" y="72" width="6" height="10" rx="1.5" /></g>
        <g class="candle down"><path d="M124 70V94" /><rect x="121" y="76" width="6" height="10" rx="1.5" /></g>
        <g class="candle up"><path d="M135 57V81" /><rect x="132" y="63" width="6" height="12" rx="1.5" /></g>
      </g>
      <rect class="accent-fill" x="95" y="113" width="23" height="8" rx="4" />
      <rect class="outline-fill" x="122" y="113" width="23" height="8" rx="4" />
      <path class="connector" d="M79 48H60C55 48 52 45 52 40V36M161 55H181C186 55 189 52 189 47V42M79 111H59C54 111 51 114 51 119V124" />
      <rect class="floating" x="17" y="18" width="48" height="31" rx="7" />
      <rect class="floating" x="175" y="18" width="48" height="31" rx="7" />
      <rect class="floating" x="17" y="112" width="48" height="31" rx="7" />
      <circle class="accent-fill" cx="28" cy="29" r="3" />
      <path class="soft-stroke" d="M36 29H54M27 39H53M185 29H212M185 39H198" />
      <circle class="accent-fill" cx="207" cy="39" r="3" />
      <path class="soft-stroke" d="M27 123H52" />
      <path class="positive-stroke" d="M27 135L36 129L43 132L54 122" />
    </g>

    <g v-else-if="variant === 3">
      <rect class="surface" x="16" y="20" width="208" height="120" rx="8" />
      <path class="divider" d="M16 42.5H224M55.5 43V140" />
      <circle class="accent-fill" cx="28" cy="31" r="3" />
      <path class="muted-stroke" d="M39 31H73" />
      <rect class="accent-soft" x="25" y="54" width="21" height="6" rx="3" />
      <path class="soft-stroke" d="M25 73H44M25 85H40M25 97H45M25 109H38" />
      <path class="grid" d="M66 58.5H212M66 80.5H212M66 102.5H212M66 124.5H212M90.5 49V130M119.5 49V130M148.5 49V130M177.5 49V130" />
      <path class="accent-area" d="M66 113C81 110 88 91 103 93C120 96 125 74 140 78C157 82 161 61 176 65C190 68 199 53 212 48V125H66Z" />
      <path class="accent-stroke chart-line" d="M66 113C81 110 88 91 103 93C120 96 125 74 140 78C157 82 161 61 176 65C190 68 199 53 212 48" />
      <path class="benchmark" d="M66 119C82 114 91 108 105 109C123 110 131 96 146 98C164 101 174 88 188 89C198 90 205 83 212 80" />
      <path class="marker" d="M148 49V130" />
      <circle class="accent-fill marker-dot" cx="148" cy="76" r="5" />
      <rect class="floating" x="156" y="89" width="52" height="27" rx="6" />
      <path class="soft-stroke" d="M165 98H198M165 107H188" />
    </g>

    <g v-else>
      <rect class="surface" x="14" y="18" width="212" height="124" rx="8" />
      <path class="divider" d="M14 40.5H226M120 41V142M14 91H226" />
      <circle class="accent-fill" cx="26" cy="29" r="3" />
      <circle class="muted-fill" cx="36" cy="29" r="3" />
      <path class="muted-stroke" d="M48 29H82" />
      <rect class="accent-soft" x="189" y="25" width="25" height="8" rx="4" />
      <path class="mini-grid" d="M24 55.5H109M24 72.5H109M35.5 48V82M57.5 48V82M79.5 48V82M101.5 48V82M131 55.5H216M131 72.5H216M142.5 48V82M164.5 48V82M186.5 48V82M208.5 48V82M24 105.5H109M24 124.5H109M35.5 98V133M57.5 98V133M79.5 98V133M101.5 98V133M131 105.5H216M131 124.5H216M142.5 98V133M164.5 98V133M186.5 98V133M208.5 98V133" />
      <path class="positive-stroke mini-line" d="M24 78L39 69L52 72L67 57L82 61L96 51L109 54" />
      <path class="negative-stroke mini-line" d="M131 54L145 62L158 58L172 73L185 68L200 78L216 70" />
      <path class="accent-stroke mini-line" d="M24 127L38 117L52 121L67 108L81 111L95 101L109 105" />
      <path class="neutral-stroke mini-line" d="M131 126L144 115L158 119L173 103L187 109L201 99L216 104" />
      <circle class="positive-fill" cx="109" cy="54" r="3" />
      <circle class="negative-fill" cx="216" cy="70" r="3" />
      <circle class="accent-fill" cx="109" cy="105" r="3" />
      <circle class="neutral-fill" cx="216" cy="104" r="3" />
    </g>
  </svg>
</template>

<style scoped>
.scene { display: block; width: 100%; height: 100%; color: var(--vp-c-brand-1); }
.surface, .inner-surface, .floating { fill: color-mix(in srgb, var(--vp-c-bg-soft) 60%, transparent); stroke: color-mix(in srgb, var(--vp-c-text-3) 42%, transparent); stroke-width: 1.25; }
.inner-surface, .floating { fill: color-mix(in srgb, var(--vp-c-bg) 82%, transparent); }
.divider, .grid, .mini-grid { stroke: color-mix(in srgb, var(--vp-c-divider) 76%, transparent); stroke-width: 1; }
.grid, .mini-grid { opacity: .72; }
.accent-stroke, .positive-stroke, .negative-stroke, .neutral-stroke, .benchmark, .connector, .muted-stroke, .soft-stroke { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.accent-stroke { stroke: var(--vp-c-brand-1); }
.positive-stroke { stroke: #2dc08e; }
.negative-stroke { stroke: #f92855; }
.neutral-stroke { stroke: var(--vp-c-text-2); }
.muted-stroke { stroke: color-mix(in srgb, var(--vp-c-text-3) 60%, transparent); stroke-width: 3; }
.soft-stroke { stroke: color-mix(in srgb, var(--vp-c-text-3) 48%, transparent); stroke-width: 2; }
.connector { stroke: color-mix(in srgb, var(--vp-c-brand-1) 54%, transparent); stroke-width: 1.25; stroke-dasharray: 3 3; }
.chart-line { stroke-width: 2.5; }
.mini-line { stroke-width: 2.25; }
.benchmark { stroke: color-mix(in srgb, var(--vp-c-text-2) 58%, transparent); stroke-width: 1.5; stroke-dasharray: 3 4; }
.accent-fill { fill: var(--vp-c-brand-1); }
.positive-fill { fill: #2dc08e; }
.negative-fill { fill: #f92855; }
.neutral-fill { fill: var(--vp-c-text-2); }
.muted-fill { fill: color-mix(in srgb, var(--vp-c-text-3) 52%, transparent); }
.soft-fill { fill: color-mix(in srgb, var(--vp-c-text-3) 34%, transparent); }
.outline-fill { fill: color-mix(in srgb, var(--vp-c-text-2) 26%, transparent); }
.accent-soft { fill: color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent); }
.accent-area { fill: color-mix(in srgb, var(--vp-c-brand-1) 9%, transparent); }
.marker { stroke: color-mix(in srgb, var(--vp-c-brand-1) 48%, transparent); stroke-width: 1; stroke-dasharray: 3 3; }
.marker-dot { stroke: var(--vp-c-bg); stroke-width: 2; }
.candles { stroke-width: 1.4; }
.candle { stroke: currentColor; }
.candle rect { fill: currentColor; stroke: none; }
.candle.up { color: #2dc08e; }
.candle.down { color: #f92855; }
.candles.small { stroke-width: 1.2; }
.use-case:hover .chart-line, .use-case:hover .mini-line { filter: drop-shadow(0 0 4px color-mix(in srgb, var(--vp-c-brand-1) 28%, transparent)); }
</style>
