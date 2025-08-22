import { CellState, TimeRange, WeekTimeGridOptions } from "./types";
import { formatTime, parseTime } from "./utils.js";

/**
 * 默认配置选项
 */
const DEFAULT_OPTIONS: Required<WeekTimeGridOptions> = {
  dayLabels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  startHour: 0,
  endHour: 24,
  timeInterval: 60, // 默认1小时
};

/**
 * 周时间网格状态管理类
 */
export class WeekTimeGridState {
  /** 网格状态（二维数组） */
  private gridState: CellState[][] = [];

  /** 当前选中的时间范围 */
  private selectedRanges: TimeRange[] = [];

  /** 配置选项 */
  private options: Required<WeekTimeGridOptions>;

  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(options: WeekTimeGridOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.initializeGrid();
  }

  /**
   * 初始化网格状态
   */
  public initializeGrid(): void {
    const { startHour, endHour, timeInterval } = this.options;
    this.gridState = [];

    // 计算每小时有多少个时间间隔
    const intervalsPerHour = 60 / timeInterval;

    // 初始化网格状态
    for (let day = 0; day < 7; day++) {
      this.gridState[day] = [];

      // 处理正常的时间范围 (0-24 小时表示24个小时的时间段)
      for (let hour = startHour; hour < endHour; hour++) {
        for (let i = 0; i < intervalsPerHour; i++) {
          const minute = i * timeInterval;
          this.gridState[day].push({
            dayOfWeek: day,
            hour,
            minute,
            selected: false,
          });
        }
      }
    }
  }

  /**
   * 更新单个单元格状态（不重新计算时间范围）
   * @param dayOfWeek 星期（0-6）
   * @param hour 小时
   * @param minute 分钟
   * @param selected 是否选中
   */
  public updateSingleCell(
    dayOfWeek: number,
    hour: number,
    minute: number,
    selected: boolean
  ): void {
    // 调试最后一列
    if (hour === 23 && minute === 0) {
      console.log(
        `[updateSingleCell] hour=23, minute=0, endHour=${this.options.endHour}`
      );
    }

    // 验证参数
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      console.log(`[updateSingleCell] Invalid dayOfWeek: ${dayOfWeek}`);
      return;
    }
    if (hour < this.options.startHour || hour >= this.options.endHour) {
      console.log(
        `[updateSingleCell] Invalid hour: ${hour}, range: ${this.options.startHour}-${this.options.endHour}`
      );
      return;
    }
    if (minute < 0 || minute >= 60) {
      console.log(`[updateSingleCell] Invalid minute: ${minute}`);
      return;
    }

    // 找到对应的单元格并更新状态
    const cell = this.findCell(dayOfWeek, hour, minute);
    if (cell) {
      cell.selected = selected;
      console.log(
        `[updateSingleCell] Updated cell ${hour}:${minute} to ${selected}`
      );
    } else {
      console.log(`[updateSingleCell] Cell not found: ${hour}:${minute}`);
    }

    // 更新选中的时间范围
    this.updateSelectedRanges();
  }

  /**
   * 更新单元格状态
   * @param dayOfWeek 星期（0-6）
   * @param hour 小时
   * @param minute 分钟
   * @param selected 是否选中
   */
  public updateCell(
    dayOfWeek: number,
    hour: number,
    minute: number,
    selected: boolean
  ): void {
    // 验证参数
    if (dayOfWeek < 0 || dayOfWeek > 6) return;
    if (hour < this.options.startHour || hour >= this.options.endHour) return;
    if (minute < 0 || minute >= 60) return;

    // 找到对应的单元格并更新状态
    const cell = this.findCell(dayOfWeek, hour, minute);
    if (cell) {
      cell.selected = selected;
    }

    // 更新选中的时间范围
    this.updateSelectedRanges();
  }

  /**
   * 查找单元格
   * @param dayOfWeek 星期（0-6）
   * @param hour 小时
   * @param minute 分钟
   * @returns 单元格状态或undefined
   */
  private findCell(
    dayOfWeek: number,
    hour: number,
    minute: number
  ): CellState | undefined {
    if (!this.gridState[dayOfWeek]) return undefined;

    return this.gridState[dayOfWeek].find(
      (cell) => cell.hour === hour && cell.minute === minute
    );
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
    const cell = this.findCell(dayOfWeek, hour, minute);

    // 调试最后一列
    if (hour === 23 && minute === 0) {
      if (!cell) {
        console.log(
          `[getCellState] Available cells for day ${dayOfWeek}:`,
          this.gridState[dayOfWeek]
            ?.map((c) => `${c.hour}:${c.minute}`)
            .slice(-5)
        );
      }
    }

    return cell ? cell.selected : false;
  }

  /**
   * 获取网格状态
   * @returns 网格状态二维数组
   */
  public getGridState(): CellState[][] {
    return this.gridState;
  }

  /**
   * 获取选中的时间范围
   * @returns 时间范围数组
   */
  public getSelectedRanges(): TimeRange[] {
    return [...this.selectedRanges];
  }

  /**
   * 设置选中的时间范围
   * @param ranges 时间范围数组
   */
  public setSelectedRanges(ranges: TimeRange[]): void {
    debugger;
    // 清除当前选中状态
    this.clearSelection();

    // 设置新的选中状态
    ranges.forEach((range) => {
      const { dayOfWeek, startTime, endTime } = range;
      const startTimeObj = parseTime(startTime);
      const endTimeObj = parseTime(endTime);

      if (!startTimeObj || !endTimeObj) return;

      // 设置选中状态
      this.setTimeRangeSelected(dayOfWeek, startTimeObj, endTimeObj, true);
    });

    // 更新选中的时间范围
    this.updateSelectedRanges();
  }

  /**
   * 设置时间范围的选中状态
   * @param dayOfWeek 星期（0-6）
   * @param startTime 开始时间对象
   * @param endTime 结束时间对象
   * @param selected 是否选中
   */
  private setTimeRangeSelected(
    dayOfWeek: number,
    startTime: { hour: number; minute: number },
    endTime: { hour: number; minute: number },
    selected: boolean
  ): void {
    if (dayOfWeek < 0 || dayOfWeek > 6) return;

    // 确保开始时间小于结束时间
    if (
      startTime.hour > endTime.hour ||
      (startTime.hour === endTime.hour && startTime.minute > endTime.minute)
    ) {
      return;
    }

    // 设置选中状态
    this.gridState[dayOfWeek].forEach((cell) => {
      const cellTime = { hour: cell.hour, minute: cell.minute };

      // 判断单元格是否在时间范围内
      if (isTimeInRange(cellTime, startTime, endTime)) {
        cell.selected = selected;
      }
    });
  }

  /**
   * 清除所有选中
   */
  public clearSelection(): void {
    this.gridState.forEach((day) => {
      day.forEach((cell) => {
        cell.selected = false;
      });
    });

    this.selectedRanges = [];
  }

  /**
   * 更新选中的时间范围
   */
  private updateSelectedRanges(): void {
    this.selectedRanges = [];

    // 遍历每一天
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const dayCells = this.gridState[dayOfWeek];
      if (!dayCells || dayCells.length === 0) continue;

      let currentRange: { start: CellState | null; end: CellState | null } = {
        start: null,
        end: null,
      };

      // 遍历当天的所有单元格
      for (let i = 0; i < dayCells.length; i++) {
        const cell = dayCells[i];

        if (cell.selected) {
          // 如果当前单元格被选中
          if (!currentRange.start) {
            // 开始一个新的范围
            currentRange.start = cell;
            currentRange.end = cell;
          } else {
            // 扩展当前范围
            currentRange.end = cell;
          }
        } else if (currentRange.start) {
          // 如果当前单元格未选中，但有一个活动范围，则结束该范围
          this.addTimeRange(currentRange.start, currentRange.end!);
          currentRange = { start: null, end: null };
        }
      }

      // 处理最后一个范围
      if (currentRange.start) {
        this.addTimeRange(currentRange.start, currentRange.end!);
      }
    }
  }

  /**
   * 添加时间范围
   * @param startCell 开始单元格
   * @param endCell 结束单元格
   */
  private addTimeRange(startCell: CellState, endCell: CellState): void {
    const { timeInterval, endHour: maxHour } = this.options;

    // 计算结束时间（需要加上时间间隔，因为endCell代表的是选中的最后一个单元格的开始时间）
    let endHour = endCell.hour;
    let endMinute = endCell.minute + timeInterval;

    // 处理分钟溢出
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }

    // 确保结束时间不超过最大小时
    if (endHour >= maxHour) {
      endHour = maxHour;
      endMinute = 0;

      // 特殊处理：如果结束时间正好是最大时间（如20:00），则调整为前一个时间间隔
      // if (timeInterval > 1) {
      //   endHour = maxHour - 1;
      //   endMinute = 60 - timeInterval;
      // }
    }

    // 创建时间范围对象
    const timeRange: TimeRange = {
      dayOfWeek: startCell.dayOfWeek,
      startTime: formatTime(startCell.hour, startCell.minute),
      endTime: formatTime(endHour, endMinute),
    };

    this.selectedRanges.push(timeRange);
  }

  /**
   * 获取配置选项
   * @returns 配置选项
   */
  public getOptions(): Required<WeekTimeGridOptions> {
    return { ...this.options };
  }
}

/**
 * 判断时间是否在范围内
 * @param time 时间对象
 * @param startTime 开始时间对象
 * @param endTime 结束时间对象
 * @returns 是否在范围内
 */
function isTimeInRange(
  time: { hour: number; minute: number },
  startTime: { hour: number; minute: number },
  endTime: { hour: number; minute: number }
): boolean {
  // 转换为分钟数进行比较
  const timeMinutes = time.hour * 60 + time.minute;
  const startMinutes = startTime.hour * 60 + startTime.minute;
  const endMinutes = endTime.hour * 60 + endTime.minute;

  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
}
