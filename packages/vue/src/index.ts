import { App } from 'vue';
import WeekTimeGrid from './WeekTimeGrid.vue';

// 导出组件
export { WeekTimeGrid };

// 默认导出
export default {
  install(app: App) {
    app.component('WeekTimeGrid', WeekTimeGrid);
  }
};

// 导出类型
export type { TimeRange, WeekTimeGridOptions } from 'weektime-picker-core';