# vite-plugin-vue-mcp

Vite plugin that enables a MCP server for your Vue app to provide information about the component tree, state, routes, and pinia tree and state.

## Installation 📦

```bash
pnpm install vite-plugin-vue-mcp -D
```

## Usage 🔨

```ts
// vite.config.ts
import { VueMcp } from 'vite-plugin-vue-mcp'

export default defineConfig({
  plugins: [VueMcp()],
})
```

## Features ✨

### Get Component Tree

![component-tree](./screenshots/component-tree.gif)

### Get Component State

![component-state](./screenshots/component-state.gif)

### Get Routes

![route-tree](./screenshots/router-info.gif)

### Get Pinia Tree

![pinia-tree](./screenshots/pinia-tree.gif)

### Get Pinia State

![pinia-state](./screenshots/pinia-state.gif)

## Notice 📝

## Credits 💖
