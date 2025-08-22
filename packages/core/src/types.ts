/**
 * 时间范围接口，表示一个选中的时间段
 */
export interface TimeRange {
  /** 星期几，0-6 表示周一到周日 */
  dayOfWeek: number;
  /** 开始时间，格式为 "HH:MM" */
  startTime: string;
  /** 结束时间，格式为 "HH:MM" */
  endTime: string;
}

/**
 * 配置选项接口
 */
export interface WeekTimeGridOptions {
  /** 星期标签，默认为周一到周日 */
  dayLabels?: string[];
  /** 开始小时，默认为0 */
  startHour?: number;
  /** 结束小时，默认为23 */
  endHour?: number;
  /** 时间间隔（分钟），默认为60（1小时） */
  timeInterval?: number;
}

/**
 * 单元格状态接口
 */
export interface CellState {
  /** 星期（0-6） */
  dayOfWeek: number;
  /** 小时 */
  hour: number;
  /** 分钟 */
  minute: number;
  /** 是否选中 */
  selected: boolean;
}

/**
 * 单元格位置接口
 */
export interface CellPosition {
  /** 星期（0-6） */
  dayOfWeek: number;
  /** 小时 */
  hour: number;
  /** 分钟 */
  minute: number;
}

/**
 * 拖动模式类型
 */
export type DragMode = 'select' | 'deselect';

/**
 * 核心类接口
 */
export interface IWeekTimeGridCore {
  /** 获取网格配置 */
  getGridConfig(): { rows: number, cols: number, dayLabels: string[], hourLabels: string[] };
  
  /** 获取单元格状态 */
  getCellState(dayOfWeek: number, hour: number, minute: number): boolean;
  
  /** 处理单元格点击 */
  handleCellClick(dayOfWeek: number, hour: number, minute: number): void;
  
  /** 处理拖动开始 */
  handleDragStart(dayOfWeek: number, hour: number, minute: number): void;
  
  /** 处理拖动移动 */
  handleDragMove(dayOfWeek: number, hour: number, minute: number): void;
  
  /** 处理拖动结束 */
  handleDragEnd(): void;
  
  /** 设置选中的时间范围 */
  setSelectedRanges(ranges: TimeRange[]): void;
  
  /** 获取选中的时间范围 */
  getSelectedRanges(): TimeRange[];
}