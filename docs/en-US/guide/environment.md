# 🏝️ Environment

## Recommended environment

It is recommended to use the library in modern browsers together with package managers such as `npm`, `pnpm`, `yarn`, or `bun`.

If you are integrating it into a production project, it is recommended to:

- Use an ESM-based build tool, such as Vite, Rspack, Webpack, or Rollup
- Initialize the chart after the client component has mounted
- Install it through a package manager instead of depending on a CDN script directly

## Browser support

The chart is built on HTML5 Canvas, so it needs to run in a browser that supports Canvas. If you need to run it on mobile, use a modern WebView.

For modern desktop and mobile browsers, it will usually run directly. If your project needs to support older environments, it is recommended to verify at least the following capabilities:

- `Map`
- `Intl`
- `requestAnimationFrame`
- Canvas-related APIs

Canvas-related API support is required. `Map`, `Intl`, and `requestAnimationFrame` are common compatibility gaps. If any of them are missing, add the corresponding polyfills yourself.

## SSR / Next.js / Nuxt notes

The chart depends on the DOM and Canvas, so it cannot be initialized directly during server-side rendering.

Recommended practices:

- Call `init(...)` only after the component has mounted
- Do not read the container DOM at the module top level
- If the page is shown on demand, initialize only after the container is actually visible, or call `resize(...)` proactively

## Container size and initialization timing

The chart fills its container automatically, so the container itself must have an explicit size.

Common recommendations:

- The container needs a definite height
- If the width comes from a responsive parent container, make sure the parent layout has stabilized
- If the container is initially `display: none` or inside an inactive tab, it is recommended to call `resize(...)` after it becomes visible

If you can only see a single line after initialization, or the chart height looks wrong, check the container size first.

## High-DPI screens and clarity

If the chart looks blurry on high-resolution screens, first check whether extra CSS scaling has been applied to the chart container.

Recommended:

- Avoid using `transform: scale(...)` on the chart container
- Avoid wrapping the chart with an extra blurred scaling container
- Call `resize(...)` promptly after size changes

## Mobile WebView notes

When using it on mobile, it is recommended to run it in a newer WebView environment whenever possible.

During integration, you usually need to pay attention to:

- Whether page scrolling conflicts with chart dragging
- Whether the parent container intercepts touch events
- Whether `resize(...)` needs to be called again after the keyboard opens or after orientation changes
- Whether styles and tooltip display need adjustment to match mobile interaction habits
