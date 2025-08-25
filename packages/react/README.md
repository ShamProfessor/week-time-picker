# WeekTime Picker

A flexible week time grid component for React applications.

## Features

- 📅 Week-based time selection grid
- ⚡ Support for React 18+
- 🎨 Customizable themes and styling
- 📱 Responsive design
- 🔧 TypeScript support
- 🎯 Flexible time intervals (15min, 30min, 1hour)

## Packages

- `@weektime-picker/react` - React component

## Installation & Usage

### React

```bash
npm install @weektime-picker/react
or
pnpm add @weektime-picker/react

```

![react示例](https://github.com/ShamProfessor/week-time-picker/blob/main/images/react.png)

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

## License

MIT
