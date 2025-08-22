import React, { useEffect, useRef, useState } from "react";
import {
  WeekTimeGridCore,
  TimeRange,
  WeekTimeGridOptions,
} from "weektime-picker-core";
import "./WeekTimeGrid.css";

export interface WeekTimeGridProps {
  /** 选中的时间范围数组 */
  value?: TimeRange[];
  /** 选中变化时的回调函数 */
  onChange?: (ranges: TimeRange[]) => void;
  /** 星期标签 */
  dayLabels?: string[];
  /** 开始小时 */
  startHour?: number;
  /** 结束小时 */
  endHour?: number;
  /** 时间间隔（分钟） */
  timeInterval?: number;
  /** 主题颜色 */
  themeColor?: string;
  /** 单元格宽度（像素），默认为0表示自适应 */
  cellWidth?: number;
}

/**
 * 周时间网格组件
 */
export const WeekTimeGrid: React.FC<WeekTimeGridProps> = ({
  value = [],
  onChange,
  dayLabels = [
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
    "星期日",
  ],
  startHour = 0,
  endHour = 24,
  timeInterval = 60,
  themeColor = "#4a89dc",
  cellWidth = 0,
}) => {
  // 核心实例引用
  const coreRef = useRef<WeekTimeGridCore | null>(null);

  // 网格配置状态
  const [gridConfig, setGridConfig] = useState<{
    rows: number;
    cols: number;
    dayLabels: string[];
    hourLabels: string[];
  }>(() => {
    // 初始化时计算网格配置
    const options: WeekTimeGridOptions = {
      dayLabels,
      startHour,
      endHour,
      timeInterval,
    };
    const core = new WeekTimeGridCore(options);
    const config = core.getGridConfig();

    coreRef.current = core;

    return config;
  });

  // 拖动状态跟踪 - 使用state而不是ref来确保同步
  const [isDragging, setIsDragging] = useState(false);
  const dragStartTimeRef = useRef<number>(0);
  const hasMovedRef = useRef(false);

  // 强制重新渲染的状态
  const [renderKey, setRenderKey] = useState(0);

  // 获取单元格状态
  const getCellState = (dayIndex: number, cellIndex: number): boolean => {
    if (!coreRef.current) return false;

    const intervalsPerHour = 60 / timeInterval;

    // 计算小时和分钟
    const hour = Math.floor(cellIndex / intervalsPerHour) + startHour;
    const minute = (cellIndex % intervalsPerHour) * timeInterval;

    return coreRef.current.getCellState(dayIndex, hour, minute);
  };

  // 处理鼠标按下事件
  const handleMouseDown = (
    dayIndex: number,
    cellIndex: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!coreRef.current) return;

    // 记录拖动开始时间和重置移动标志
    dragStartTimeRef.current = Date.now();
    hasMovedRef.current = false;
    // 注意：这里不立即设置 isDragging，等到真正移动时再设置

    const intervalsPerHour = 60 / timeInterval;
    const hour = Math.floor(cellIndex / intervalsPerHour) + startHour;
    const minute = (cellIndex % intervalsPerHour) * timeInterval;

    // 开始拖拽准备，但不立即进入拖拽状态
    coreRef.current.handleDragStart(dayIndex, hour, minute);
  };

  // 处理鼠标移动事件
  const handleMouseMove = (
    dayIndex: number,
    cellIndex: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!coreRef.current) return;

    // 检查是否已经按下鼠标（通过时间戳判断）
    if (dragStartTimeRef.current === 0) return;

    // 第一次移动时，设置为拖拽状态
    if (!isDragging) {
      setIsDragging(true);
    }

    // 标记已经移动，这是真正的拖动
    hasMovedRef.current = true;

    const intervalsPerHour = 60 / timeInterval;
    const hour = Math.floor(cellIndex / intervalsPerHour) + startHour;
    const minute = (cellIndex % intervalsPerHour) * timeInterval;

    coreRef.current.handleDragMove(dayIndex, hour, minute);

    // 触发重新渲染以显示拖动预览
    setRenderKey((prev) => prev + 1);
  };

  // 处理鼠标抬起事件（只处理拖拽结束）
  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 只在拖拽状态下处理
    if (!coreRef.current || !isDragging) {
      // 重置拖拽准备状态
      dragStartTimeRef.current = 0;
      hasMovedRef.current = false;
      return;
    }

    const dragDuration = Date.now() - dragStartTimeRef.current;

    // 结束拖动操作
    coreRef.current.handleDragEnd();

    // 重置所有状态
    setIsDragging(false);
    hasMovedRef.current = false;
    dragStartTimeRef.current = 0;

    // 触发重新渲染
    setRenderKey((prev) => prev + 1);

    // 手动触发onChange回调
    if (onChange) {
      const ranges = coreRef.current.getSelectedRanges();
      console.log(`[MouseUp] 拖动结果:`, ranges);
      onChange(ranges);
    }
  };

  // 处理单元格点击事件（直接点击，不拖动）
  const handleCellClick = (
    dayIndex: number,
    cellIndex: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    console.log(
      `[Click] 触发点击事件, isDragging=${isDragging}, hasMoved=${hasMovedRef.current}`
    );

    // 如果正在拖拽或刚刚完成拖拽，阻止点击
    if (!coreRef.current || isDragging || hasMovedRef.current) {
      console.log(
        `[Click] 被阻止: isDragging=${isDragging}, hasMoved=${hasMovedRef.current}`
      );
      // 重置状态
      dragStartTimeRef.current = 0;
      hasMovedRef.current = false;
      return;
    }

    const intervalsPerHour = 60 / timeInterval;
    const hour = Math.floor(cellIndex / intervalsPerHour) + startHour;
    const minute = (cellIndex % intervalsPerHour) * timeInterval;

    console.log(
      `[Click] 执行点击操作: day=${dayIndex}, cell=${cellIndex}, hour=${hour}, minute=${minute}, endHour=${endHour}, cols=${gridConfig.cols}`
    );

    coreRef.current.handleCellClick(dayIndex, hour, minute);

    // 重置状态
    dragStartTimeRef.current = 0;
    hasMovedRef.current = false;

    // 强制重新渲染
    setRenderKey((prev) => prev + 1);

    // 手动触发onChange回调
    if (onChange) {
      const ranges = coreRef.current.getSelectedRanges();
      console.log(`[Click] 结果范围:`, ranges);
      onChange(ranges);
    }
  };

  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    if (!coreRef.current || !isDragging) return;

    console.log(`[MouseLeave] 结束拖动`);

    coreRef.current.handleDragEnd();

    // 重置拖动状态
    setIsDragging(false);
    hasMovedRef.current = false;

    // 触发重新渲染
    setRenderKey((prev) => prev + 1);

    // 手动触发onChange回调
    if (onChange) {
      const ranges = coreRef.current.getSelectedRanges();
      onChange(ranges);
    }
  };

  // 监听 props 变化
  useEffect(() => {
    // 重新初始化核心实例
    const options: WeekTimeGridOptions = {
      dayLabels,
      startHour,
      endHour,
      timeInterval,
    };

    // 创建新的核心实例，不传入onChange回调避免循环
    const core = new WeekTimeGridCore(options);
    coreRef.current = core;

    // 设置初始选中范围
    if (value && value.length > 0) {
      core.setSelectedRanges(value);
    }

    // 更新网格配置
    const config = core.getGridConfig();
    console.log(
      `[GridConfig] cols=${config.cols}, endHour=${endHour}, startHour=${startHour}`
    );
    setGridConfig(config);

    // 触发重新渲染
    // setRenderKey((prev) => prev + 1);
  }, [dayLabels, startHour, endHour, timeInterval]);

  // 监听 value 变化
  useEffect(() => {
    if (coreRef.current && value) {
      // 检查新旧值是否相同，避免不必要的更新
      const currentRanges = coreRef.current.getSelectedRanges();
      if (JSON.stringify(currentRanges) !== JSON.stringify(value)) {
        // 更新选中范围
        coreRef.current.setSelectedRanges(value);
        // 触发重新渲染
        // setRenderKey((prev) => prev + 1);
      }
    }
  }, [value]);

  return (
    <div
      className="week-time-grid"
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      style={{ "--theme-color": themeColor } as React.CSSProperties}
    >
      {/* 表头 - 时间标签 */}
      <div className="week-time-grid__header">
        <div className="week-time-grid__header-cell week-time-grid__header-cell--empty">
          星期/时间
        </div>
        {Array.from({ length: endHour - startHour }).map((_, cellIndex) => {
          return (
            <div
              key={`time-${cellIndex}`}
              className="week-time-grid__header-cell week-time-grid__header-cell--time"
            >
              {cellIndex}
            </div>
          );
        })}
      </div>
      {/* 网格主体 */}
      <div className="week-time-grid__body">
        {gridConfig.dayLabels.map((dayLabel, dayIndex) => (
          <div key={`day-${dayIndex}`} className="week-time-grid__row">
            {/* 行标签（星期） */}
            <div className="week-time-grid__row-label">{dayLabel}</div>

            {/* 单元格 */}
            {Array.from({ length: gridConfig.cols }).map((_, cellIndex) => (
              <div
                key={`cell-${dayIndex}-${cellIndex}-${renderKey}`}
                className={`week-time-grid__cell ${
                  getCellState(dayIndex, cellIndex)
                    ? "week-time-grid__cell--selected"
                    : ""
                }`}
                style={
                  cellWidth > 0
                    ? { flex: "0 0 auto", width: `${cellWidth}px` }
                    : {}
                }
                data-day={dayIndex}
                data-cell={cellIndex}
                onMouseDown={(e) => handleMouseDown(dayIndex, cellIndex, e)}
                onMouseMove={(e) => handleMouseMove(dayIndex, cellIndex, e)}
                onClick={(e) => handleCellClick(dayIndex, cellIndex, e)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekTimeGrid;
