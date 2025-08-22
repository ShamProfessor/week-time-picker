# WeekTime Picker

A flexible week time grid component for Vue and React applications.

## Features

- 📅 Week-based time selection grid
- ⚡ Support for Vue 3 and React 18+
- 🎨 Customizable themes and styling
- 📱 Responsive design
- 🔧 TypeScript support
- 🎯 Flexible time intervals (15min, 30min, 1hour)

## Packages

- `@weektime-picker/core` - Core logic and utilities
- `@weektime-picker/vue` - Vue 3 component
- `@weektime-picker/react` - React component

## Installation & Usage

### Vue 3

```bash
npm install @weektime-picker/vue
```

```vue
<template>
  <WeekTimeGrid
    :selectedRanges="selectedRanges"
    @selectedRangesChange="handleSelectedRangesChange"
    :startHour="9"
    :endHour="18"
    :timeInterval="60"
  />
</template>

<script setup>
import { ref } from "vue";
import { WeekTimeGrid } from "@weektime-picker/vue";

const selectedRanges = ref([]);
const handleSelectedRangesChange = (ranges) => {
  selectedRanges.value = ranges;
};
</script>
```

### React

```bash
npm install @weektime-picker/react
```

```jsx
import React, { useState } from "react";
import { WeekTimeGrid } from "@weektime-picker/react";

function App() {
  const [selectedRanges, setSelectedRanges] = useState([]);

  return (
    <WeekTimeGrid
      selectedRanges={selectedRanges}
      onSelectedRangesChange={setSelectedRanges}
      startHour={9}
      endHour={18}
      timeInterval={60}
    />
  );
}
```

## API

### Props

| Prop                                                             | Type          | Default                 | Description                           |
| ---------------------------------------------------------------- | ------------- | ----------------------- | ------------------------------------- |
| `selectedRanges`                                                 | `TimeRange[]` | `[]`                    | Array of selected time ranges         |
| `onSelectedRangesChange` (React) / `@selectedRangesChange` (Vue) | `Function`    | -                       | Callback when selection changes       |
| `startHour`                                                      | `number`      | `0`                     | Start hour (0-23)                     |
| `endHour`                                                        | `number`      | `24`                    | End hour (1-24)                       |
| `timeInterval`                                                   | `number`      | `60`                    | Time interval in minutes (15, 30, 60) |
| `themeColor`                                                     | `string`      | `'#4a89dc'`             | Theme color for selected cells        |
| `dayLabels`                                                      | `string[]`    | `['周一', '周二', ...]` | Custom day labels                     |

### Types

```typescript
interface TimeRange {
  day: number; // 0-6 (Monday to Sunday)
  startTime: number; // Start time in minutes from 00:00
  endTime: number; // End time in minutes from 00:00
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Release packages
pnpm release
```

## License

MIT
