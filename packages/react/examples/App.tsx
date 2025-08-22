import React, { useCallback, useState } from "react";
import { WeekTimeGrid, TimeRange } from "../src";
import "./App.css";

const App: React.FC = () => {
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
  const [selectedRanges, setSelectedRanges] = useState<TimeRange[]>([]);

  // 配置选项
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(24);
  const [timeInterval, setTimeInterval] = useState(60);
  const [themeColor, setThemeColor] = useState("#4a89dc");

  // 处理变更事件
  const handleChange = useCallback((ranges: TimeRange[]) => {
    setSelectedRanges(ranges);
    console.log("选中的时间范围变化：", ranges);
  }, []);

  // 清空选择
  const clearSelection = () => {
    setSelectedRanges([]);
  };

  return (
    <div className="example-container">
      <h1>WeekTimeGrid React 示例</h1>
      <div className="controls">
        <div className="control-group">
          <label>时间间隔：</label>
          <select
            value={timeInterval}
            onChange={(e) => setTimeInterval(Number(e.target.value))}
          >
            <option value={60}>1小时</option>
            <option value={30}>30分钟</option>
            <option value={15}>15分钟</option>
          </select>
        </div>

        <div className="control-group">
          <label>时间范围：</label>
          <select
            value={startHour}
            onChange={(e) => setStartHour(Number(e.target.value))}
          >
            {Array.from({ length: 25 }).map((_, i) => (
              <option key={`start-${i}`} value={i}>
                {i}:00
              </option>
            ))}
          </select>
          <span>至</span>
          <select
            value={endHour}
            onChange={(e) => setEndHour(Number(e.target.value))}
          >
            {Array.from({ length: 25 }).map((_, i) => (
              <option key={`end-${i}`} value={i}>
                {i}:00
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>颜色主题：</label>
          <input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            className="color-picker"
            title="选择颜色"
          />
        </div>

        <button onClick={clearSelection}>清空选择</button>
      </div>

      <div className="grid-container">
        <WeekTimeGrid
          value={selectedRanges}
          onChange={handleChange}
          dayLabels={dayLabels}
          startHour={startHour}
          endHour={endHour}
          timeInterval={timeInterval}
          themeColor={themeColor}
        />
      </div>

      <div className="selected-ranges">
        <h2>已选择的时间段：</h2>
        {selectedRanges.length === 0 ? (
          <div className="no-selection">暂无选择</div>
        ) : (
          <ul>
            {selectedRanges.map((range, index) => (
              <li key={index}>
                {dayLabels[range.dayOfWeek]}: {range.startTime} -{" "}
                {range.endTime}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
