<template>
  <div
    class="week-time-grid"
    @mouseleave="handleMouseLeave"
    @mouseup="handleMouseUp"
  >
    <!-- 表头 - 时间标签 -->
    <div class="week-time-grid__header">
      <div
        class="week-time-grid__header-cell week-time-grid__header-cell--empty"
      >
        星期/时间
      </div>
      <div
        v-for="(_, cellIndex) in Array(endHour - startHour).fill(null)"
        :key="'time-' + cellIndex"
        class="week-time-grid__header-cell week-time-grid__header-cell--time"
      >
        {{ cellIndex }}
      </div>
    </div>

    <!-- 网格主体 -->
    <div class="week-time-grid__body">
      <!-- 每一行（星期） -->
      <div
        v-for="(dayLabel, dayIndex) in dayLabels"
        :key="'day-' + dayIndex"
        class="week-time-grid__row"
      >
        <!-- 行标签（星期） -->
        <div class="week-time-grid__row-label">{{ dayLabel }}</div>

        <!-- 单元格 -->
        <div
          v-for="(_, cellIndex) in hourLabels"
          :key="'cell-' + dayIndex + '-' + cellIndex"
          class="week-time-grid__cell"
          :class="{
            'week-time-grid__cell--selected': getCellState(dayIndex, cellIndex),
          }"
          @mousedown.stop="handleMouseDown(dayIndex, cellIndex)"
          @mousemove.stop="handleMouseMove(dayIndex, cellIndex)"
          @click.stop="handleCellClick(dayIndex, cellIndex)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  PropType,
} from "vue";
import {
  WeekTimeGridCore,
  TimeRange,
  WeekTimeGridOptions,
} from "weektime-picker-core";

export default defineComponent({
  name: "WeekTimeGrid",

  props: {
    // v-model 绑定值
    modelValue: {
      type: Array as PropType<TimeRange[]>,
      default: () => [],
    },
    // 星期标签
    dayLabels: {
      type: Array as PropType<string[]>,
      default: () => [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ],
    },
    // 开始小时
    startHour: {
      type: Number,
      default: 0,
    },
    // 结束小时
    endHour: {
      type: Number,
      default: 23,
    },
    // 时间间隔（分钟）
    timeInterval: {
      type: Number,
      default: 60,
    },
    // 颜色主题
    themeColor: {
      type: String,
      default: "#4a89dc",
    },
  },

  emits: ["update:modelValue", "change"],

  setup(props, { emit }) {
    // 创建核心实例
    const core = ref<WeekTimeGridCore | null>(null);
    const rerenderKey = ref(0);

    // 拖动状态跟踪
    const isDragging = ref(false);

    // 计算网格配置
    const gridConfig = computed(() => {
      if (!core.value)
        return { rows: 7, cols: 24, dayLabels: [], hourLabels: [] };
      return core.value.getGridConfig();
    });

    // 提取小时标签
    const hourLabels = computed(() => gridConfig.value.hourLabels);
    const dayLabels = computed(() => gridConfig.value.dayLabels);

    // 初始化核心实例
    const initCore = () => {
      const options: WeekTimeGridOptions = {
        dayLabels: props.dayLabels,
        startHour: props.startHour,
        endHour: props.endHour,
        timeInterval: props.timeInterval,
      };

      core.value = new WeekTimeGridCore(options, handleChange);

      // 设置初始选中范围
      if (props.modelValue.length > 0) {
        core.value.setSelectedRanges(props.modelValue);
      }
    };

    // 处理变更事件
    const handleChange = (ranges: TimeRange[]) => {
      emit("update:modelValue", ranges);
      emit("change", ranges);
    };

    // 获取单元格状态
    const getCellState = (dayIndex: number, cellIndex: number) => {
      if (!core.value) return false;

      const { startHour, timeInterval } = props;
      const intervalsPerHour = 60 / timeInterval;

      // 计算小时和分钟
      const hour = Math.floor(cellIndex / intervalsPerHour) + startHour;
      const minute = (cellIndex % intervalsPerHour) * timeInterval;

      return core.value.getCellState(dayIndex, hour, minute);
    };

    // 拖拽状态跟踪
    const dragStartTime = ref<number>(0);
    const hasMoved = ref<boolean>(false);

    // 处理鼠标按下事件
    const handleMouseDown = (dayIndex: number, cellIndex: number) => {
      if (!core.value) return;

      // 记录拖动开始时间和重置移动标志
      dragStartTime.value = Date.now();
      hasMoved.value = false;
      // 注意：这里不立即设置 isDragging，等到真正移动时再设置

      const { startHour, timeInterval } = props;
      const intervalsPerHour = 60 / timeInterval;

      // 计算小时和分钟
      const hour = Math.floor(cellIndex / intervalsPerHour) + startHour;
      const minute = (cellIndex % intervalsPerHour) * timeInterval;

      // 开始拖拽准备，但不立即进入拖拽状态
      core.value.handleDragStart(dayIndex, hour, minute);
    };

    // 处理鼠标移动事件
    const handleMouseMove = (dayIndex: number, cellIndex: number) => {
      if (!core.value) return;

      // 检查是否已经按下鼠标（通过时间戳判断）
      if (dragStartTime.value === 0) return;

      // 第一次移动时，设置为拖拽状态
      if (!isDragging.value) {
        isDragging.value = true;
      }

      // 标记已经移动，这是真正的拖动
      hasMoved.value = true;

      const { startHour, timeInterval } = props;
      const intervalsPerHour = 60 / timeInterval;

      // 计算小时和分钟
      const hour = Math.floor(cellIndex / intervalsPerHour) + startHour;
      const minute = (cellIndex % intervalsPerHour) * timeInterval;

      core.value.handleDragMove(dayIndex, hour, minute);

      // 触发重新渲染以显示拖动预览
      rerenderKey.value += 1;
    };

    // 处理鼠标抬起事件（只处理拖拽结束）
    const handleMouseUp = () => {
      // 只在拖拽状态下处理
      if (!core.value || !isDragging.value) {
        // 重置拖拽准备状态
        dragStartTime.value = 0;
        hasMoved.value = false;
        return;
      }

      // 结束拖动操作
      core.value.handleDragEnd();

      // 重置所有状态
      isDragging.value = false;
      hasMoved.value = false;
      dragStartTime.value = 0;

      // 触发重新渲染
      rerenderKey.value += 1;
    };

    // 处理单元格点击事件（直接点击，不拖动）
    const handleCellClick = (dayIndex: number, cellIndex: number) => {
      // 如果正在拖拽或刚刚完成拖拽，阻止点击
      if (!core.value || isDragging.value || hasMoved.value) {
        // 重置状态
        dragStartTime.value = 0;
        hasMoved.value = false;
        return;
      }

      const { startHour, timeInterval } = props;
      const intervalsPerHour = 60 / timeInterval;

      // 计算小时和分钟
      const hour = Math.floor(cellIndex / intervalsPerHour) + startHour;
      const minute = (cellIndex % intervalsPerHour) * timeInterval;

      // 直接调用核心方法处理点击
      core.value.handleCellClick(dayIndex, hour, minute);

      // 重置状态
      dragStartTime.value = 0;
      hasMoved.value = false;

      // 触发重新渲染
      rerenderKey.value += 1;
    };

    // 处理鼠标离开事件
    const handleMouseLeave = () => {
      if (!core.value || !isDragging.value) return;

      core.value.handleDragEnd();

      // 重置拖动状态
      isDragging.value = false;
      hasMoved.value = false;
      dragStartTime.value = 0;

      // 触发重新渲染
      rerenderKey.value += 1;
    };

    // 监听属性变化
    watch(
      () => [
        props.dayLabels,
        props.startHour,
        props.endHour,
        props.timeInterval,
      ],
      () => {
        // 重新初始化核心实例
        initCore();
      },
      { deep: true }
    );

    // 监听 modelValue 变化
    watch(
      () => props.modelValue,
      (newValue) => {
        if (core.value) {
          // 检查新旧值是否相同，避免不必要的更新
          const currentRanges = core.value.getSelectedRanges();
          rerenderKey.value += 1;

          if (JSON.stringify(newValue) !== JSON.stringify(currentRanges)) {
            // 更新选中范围
            core.value.setSelectedRanges(newValue);
          }
        }
      },
      { deep: true }
    );

    // 组件挂载时初始化
    onMounted(() => {
      initCore();
    });

    return {
      gridConfig,
      hourLabels,
      dayLabels,
      getCellState,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleMouseLeave,
      handleCellClick,
      rerenderKey,
    };
  },
});
</script>

<style>
/* WeekTimeGrid 组件样式 */
.week-time-grid {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --label-width: 80px;
}

/* Header 样式 */
.week-time-grid__header {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  position: relative;
}

.week-time-grid__header-cell {
  text-align: center;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  padding: 8px 4px;
  position: relative;
  flex: 1;
  min-width: 0;
}

.week-time-grid__header-cell--empty {
  flex: 0 0 var(--label-width);
  width: var(--label-width);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

/* Header中的divider线 */
.week-time-grid__header-cell:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #e0e0e0;
}

/* Body 样式 */
.week-time-grid__body {
  display: flex;
  flex-direction: column;
}

.week-time-grid__row {
  display: flex;
  box-sizing: border-box;
  position: relative;
}

.week-time-grid__row:not(:last-child) {
  border-bottom: 1px solid #e0e0e0;
}

.week-time-grid__row-label {
  flex: 0 0 var(--label-width);
  width: var(--label-width);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 8px;
  position: relative;
}

.week-time-grid__row-label::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #e0e0e0;
}

/* Cell中的divider线 */
.week-time-grid__cell {
  flex: 1;
  height: 36px;
  cursor: pointer;
  transition: background-color 0.1s ease;
  box-sizing: border-box;
  min-width: 0;
  position: relative;
}

.week-time-grid__cell:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #e0e0e0;
}

.week-time-grid__cell:hover {
  background-color: #f0f7ff;
}

.week-time-grid__cell--selected {
  background-color: v-bind(themeColor);
}

.week-time-grid__cell--selected:hover {
  background-color: v-bind(themeColor);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .week-time-grid__header-cell,
  .week-time-grid__cell {
    min-width: 20px;
  }

  .week-time-grid__header-cell {
    font-size: 10px;
    padding: 2px 1px;
  }

  .week-time-grid__cell {
    height: 24px;
  }
}
</style>
