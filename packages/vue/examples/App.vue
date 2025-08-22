<template>
  <div class="example-container">
    <h1>WeekTimeGrid Vue 示例</h1>

    <div class="controls">
      <div class="control-group">
        <label>时间间隔：</label>
        <select v-model="timeInterval">
          <option :value="60">1小时</option>
          <option :value="30">30分钟</option>
          <option :value="15">15分钟</option>
        </select>
      </div>

      <div class="control-group">
        <label>时间范围：</label>
        <select v-model="startHour">
          <option
            v-for="hour in 25"
            :key="'start-' + (hour - 1)"
            :value="hour - 1"
          >
            {{ hour - 1 }}:00
          </option>
        </select>
        <span>至</span>
        <select v-model="endHour">
          <option
            v-for="hour in 25"
            :key="'end-' + (hour - 1)"
            :value="hour - 1"
          >
            {{ hour - 1 }}:00
          </option>
        </select>
      </div>

      <div class="control-group">
        <label>颜色主题：</label>
        <!-- 颜色选择器 -->
        <input
          type="color"
          v-model="themeColor"
          class="color-picker"
          title="Pick a color"
        />
      </div>

      <button @click="clearSelection">清空选择</button>
    </div>

    <div class="grid-container">
      <WeekTimeGrid
        v-model="selectedRanges"
        :day-labels="dayLabels"
        :start-hour="startHour"
        :end-hour="endHour"
        :time-interval="timeInterval"
        :themeColor="themeColor"
      />
    </div>

    <div class="selected-ranges">
      <h2>已选择的时间段：</h2>
      <div v-if="selectedRanges.length === 0" class="no-selection">
        暂无选择
      </div>
      <ul v-else>
        <li v-for="(range, index) in selectedRanges" :key="index">
          {{ dayLabels[range.dayOfWeek] }}: {{ range.startTime }} -
          {{ range.endTime }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { WeekTimeGrid, TimeRange } from "../src";

export default defineComponent({
  name: "App",
  components: {
    WeekTimeGrid,
  },
  setup() {
    // 星期标签
    const dayLabels = [
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
      "星期日",
    ];

    // 选中的时间范围
    const selectedRanges = ref<TimeRange[]>([]);

    // 配置选项
    const startHour = ref(0);
    const endHour = ref(24);
    const timeInterval = ref(60);
    const themeColor = ref("#4a89dc");

    // 处理变更事件
    const handleChange = (ranges: TimeRange[]) => {
      console.log("选中的时间范围变化：", ranges);
    };

    // 清空选择
    const clearSelection = () => {
      selectedRanges.value = [];
    };

    return {
      dayLabels,
      selectedRanges,
      startHour,
      endHour,
      timeInterval,
      themeColor,
      handleChange,
      clearSelection,
    };
  },
});
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

.example-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-top: 0;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

select,
button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

button {
  background-color: #4a89dc;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #3a79cc;
}

.grid-container {
  margin-bottom: 20px;
}

.selected-ranges {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.selected-ranges h2 {
  margin-top: 0;
  font-size: 18px;
  color: #333;
}

.no-selection {
  color: #888;
  font-style: italic;
}

ul {
  padding-left: 20px;
  margin: 0;
}

li {
  margin-bottom: 8px;
}

.color-picker {
  width: 40px;
  height: 32px;
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}
</style>
