import {
  CellPosition,
  DragMode,
  IWeekTimeGridCore,
  TimeRange,
  WeekTimeGridOptions,
} from "./types";
import { WeekTimeGridState } from "./state.js";
import { formatTime } from "./utils.js";

/**
 * 周时间网格核心类
 */
export class WeekTimeGridCore implements IWeekTimeGridCore {
  /** 状态管理实例 */
  private state: WeekTimeGridState;

  /** 拖动模式 */
  private dragMode: DragMode = "select";

  /** 拖动起始位置 */
  private dragStart: CellPosition | null = null;

  /** 拖动结束位置 */
  private dragEnd: CellPosition | null = null;

  /** 拖动过程中的临时状态 */
  private tempState: Map<string, boolean> = new Map();

  /** 状态变更回调函数 */
  private onChangeCallback: ((ranges: TimeRange[]) => void) | null = null;

  /**
   * 构造函数
   * @param options 配置选项
   * @param onChange 状态变更回调函数
   */
  constructor(
    options: WeekTimeGridOptions = {},
    onChange?: (ranges: TimeRange[]) => void
  ) {
    this.state = new WeekTimeGridState(options);
    if (onChange) {
      this.onChangeCallback = onChange;
    }
  }

  /**
   * 获取网格配置
   * @returns 网格配置对象
   */
  public getGridConfig() {
    const options = this.state.getOptions();
    const { dayLabels, startHour, endHour, timeInterval } = options;

    // 计算列数
    // 当表示一整天时，0-24表示24个小时的时间段，应该有24列
    const hoursCount = endHour - startHour;
    const intervalsPerHour = 60 / timeInterval;
    const cols = hoursCount * intervalsPerHour;

    // 生成小时标签
    const hourLabels: string[] = [];
    const totalIntervals = cols;

    for (let i = 0; i < totalIntervals; i++) {
      const hour = Math.floor(i / intervalsPerHour) + startHour;
      const minute = (i % intervalsPerHour) * timeInterval;

      // 只在整点标记小时
      if (minute === 0) {
        hourLabels.push(formatTime(hour, 0));
      } else {
        hourLabels.push("");
      }
    }

    return {
      rows: 7, // 7天
      cols,
      dayLabels,
      hourLabels,
    };
  }

  /**
   * 获取单元格状态
   * @param dayOfWeek 星期（0-6）
   * @param hour 小时
   * @param minute 分钟
   * @returns 是否选中
   */
  public getCellState(
    dayOfWeek: number,
    hour: number,
    minute: number
  ): boolean {
    // 如果正在拖动，检查临时状态
    if (this.dragStart) {
      const key = `${dayOfWeek}-${hour}-${minute}`;
      if (this.tempState.has(key)) {
        return this.tempState.get(key)!;
      }
    }

    return this.state.getCellState(dayOfWeek, hour, minute);
  }

  /**\n   * 处理单元格点击\n   * @param dayOfWeek 星期（0-6）\n   * @param hour 小时\n   * @param minute 分钟\n   */
  public handleCellClick(
    dayOfWeek: number,
    hour: number,
    minute: number
  ): void {
    // 获取当前单元格状态
    const currentState = this.state.getCellState(dayOfWeek, hour, minute);

    // 直接更新当前单元格状态，不影响其他单元格
    this.state.updateSingleCell(dayOfWeek, hour, minute, !currentState);

    // 触发回调
    this.triggerChangeCallback();
  }

  /**
   * 处理拖动开始
   * @param dayOfWeek 星期（0-6）
   * @param hour 小时
   * @param minute 分钟
   */
  public handleDragStart(
    dayOfWeek: number,
    hour: number,
    minute: number
  ): void {
    // 记录拖动起始位置
    this.dragStart = { dayOfWeek, hour, minute };
    this.dragEnd = { dayOfWeek, hour, minute };

    // 确定拖动模式（选中或取消选中）
    const currentState = this.state.getCellState(dayOfWeek, hour, minute);
    this.dragMode = currentState ? "deselect" : "select";

    // 清空临时状态
    this.tempState.clear();

    // 注意：不在拖动开始时设置起始单元格的临时状态
    // 这会干扰点击事件的处理
  }

  /**
   * 处理拖动移动
   * @param dayOfWeek 星期（0-6）
   * @param hour 小时
   * @param minute 分钟
   */
  public handleDragMove(dayOfWeek: number, hour: number, minute: number): void {
    if (!this.dragStart) return;

    // 更新拖动结束位置
    this.dragEnd = { dayOfWeek, hour, minute };

    // 计算拖动范围内的所有单元格
    this.updateDragSelection();
  }

  /**
   * 处理拖动结束
   */
  public handleDragEnd(): void {
    if (!this.dragStart || !this.dragEnd) return;

    // 应用临时状态到实际状态
    this.tempState.forEach((selected, key) => {
      const [dayOfWeek, hour, minute] = key.split("-").map(Number);
      this.state.updateCell(dayOfWeek, hour, minute, selected);
    });

    // 清空拖动状态
    this.dragStart = null;
    this.dragEnd = null;
    this.tempState.clear();

    // 触发回调
    this.triggerChangeCallback();
  }

  /**
   * 更新拖动选择
   */
  private updateDragSelection(): void {
    if (!this.dragStart || !this.dragEnd) return;

    // 清空临时状态
    this.tempState.clear();

    // 获取配置选项
    const options = this.state.getOptions();
    const { startHour: minHour, endHour: maxHour, timeInterval } = options;

    // 确定拖动范围
    const startDay = Math.min(this.dragStart.dayOfWeek, this.dragEnd.dayOfWeek);
    const endDay = Math.max(this.dragStart.dayOfWeek, this.dragEnd.dayOfWeek);

    // 计算每小时有多少个时间间隔
    const intervalsPerHour = 60 / timeInterval;

    // 确定时间范围
    const startTime = this.timeToMinutes(
      this.dragStart.hour,
      this.dragStart.minute
    );
    const endTime = this.timeToMinutes(this.dragEnd.hour, this.dragEnd.minute);

    // 确保开始时间小于等于结束时间
    const actualStartTime = Math.min(startTime, endTime);
    const actualEndTime = Math.max(startTime, endTime);

    // 遍历拖动范围内的每一天
    for (let day = startDay; day <= endDay; day++) {
      // 遍历范围内的所有时间点
      for (let i = 0; i < (maxHour - minHour) * intervalsPerHour; i++) {
        const hour = Math.floor(i / intervalsPerHour) + minHour;
        const minute = (i % intervalsPerHour) * timeInterval;
        const cellTime = this.timeToMinutes(hour, minute);
        
        // 检查时间点是否在范围内
        if (cellTime >= actualStartTime && cellTime <= actualEndTime) {
          // 设置临时状态
          const key = `${day}-${hour}-${minute}`;
          this.tempState.set(key, this.dragMode === "select");
        }
      }
    }
  }

  /**
   * 设置临时范围状态
   * @param dayOfWeek 星期（0-6）
   * @param startHour 开始小时
   * @param startTotalMinutes 开始时间（分钟数）
   * @param endHour 结束小时
   * @param endTotalMinutes 结束时间（分钟数）
   */
  private setTempRangeState(
    dayOfWeek: number,
    startHour: number,
    startTotalMinutes: number,
    endHour: number,
    endTotalMinutes: number
  ): void {
    const options = this.state.getOptions();
    const { startHour: minHour, endHour: maxHour, timeInterval } = options;

    // 确保时间在有效范围内
    startHour = Math.max(startHour, minHour);
    endHour = Math.min(endHour, maxHour); // 修正：确保不超过最大有效小时

    // 计算每小时有多少个时间间隔
    const intervalsPerHour = 60 / timeInterval;

    // 遍历范围内的所有单元格
    for (let hour = startHour; hour < endHour; hour++) { // 修改为 < 而不是 <=
      // 确保小时在有效范围内
      if (hour >= maxHour) break;

      for (let i = 0; i < intervalsPerHour; i++) {
        const minute = i * timeInterval;
        const cellTotalMinutes = hour * 60 + minute;

        // 检查是否在范围内（使用左闭右开区间 [start, end)）
        if (cellTotalMinutes >= startTotalMinutes && cellTotalMinutes < endTotalMinutes) {
          // 设置临时状态
          const key = `${dayOfWeek}-${hour}-${minute}`;
          this.tempState.set(key, this.dragMode === "select");
        }
      }
    }
  }

  /**
   * 将时间转换为分钟数
   * @param hour 小时
   * @param minute 分钟
   * @returns 分钟数
   */
  private timeToMinutes(hour: number, minute: number): number {
    return hour * 60 + minute;
  }

  /**
   * 设置选中的时间范围
   * @param ranges 时间范围数组
   */
  public setSelectedRanges(ranges: TimeRange[]): void {
    this.state.setSelectedRanges(ranges);
    this.triggerChangeCallback();
  }

  /**
   * 获取选中的时间范围
   * @returns 时间范围数组
   */
  public getSelectedRanges(): TimeRange[] {
    return this.state.getSelectedRanges();
  }

  /**
   * 清除所有选中
   */
  public clearSelection(): void {
    this.state.clearSelection();
    this.triggerChangeCallback();
  }

  /**
   * 触发状态变更回调
   */
  private triggerChangeCallback(): void {
    if (this.onChangeCallback) {
      const ranges = this.getSelectedRanges();
      this.onChangeCallback(ranges);
    }
  }

  /**
   * 设置状态变更回调函数
   * @param callback 回调函数
   */
  public setOnChangeCallback(callback: (ranges: TimeRange[]) => void): void {
    this.onChangeCallback = callback;
  }

  /**
   * 获取状态管理实例（用于调试）
   * @returns 状态管理实例
   */
  public getState(): WeekTimeGridState {
    return this.state;
  }
}
