import { IWeekTimeGridCore, TimeRange, WeekTimeGridOptions } from "./types";
import { WeekTimeGridState } from "./state.js";
/**
 * 周时间网格核心类
 */
export declare class WeekTimeGridCore implements IWeekTimeGridCore {
    /** 状态管理实例 */
    private state;
    /** 拖动模式 */
    private dragMode;
    /** 拖动起始位置 */
    private dragStart;
    /** 拖动结束位置 */
    private dragEnd;
    /** 拖动过程中的临时状态 */
    private tempState;
    /** 状态变更回调函数 */
    private onChangeCallback;
    /**
     * 构造函数
     * @param options 配置选项
     * @param onChange 状态变更回调函数
     */
    constructor(options?: WeekTimeGridOptions, onChange?: (ranges: TimeRange[]) => void);
    /**
     * 获取网格配置
     * @returns 网格配置对象
     */
    getGridConfig(): {
        rows: number;
        cols: number;
        dayLabels: string[];
        hourLabels: string[];
    };
    /**
     * 获取单元格状态
     * @param dayOfWeek 星期（0-6）
     * @param hour 小时
     * @param minute 分钟
     * @returns 是否选中
     */
    getCellState(dayOfWeek: number, hour: number, minute: number): boolean;
    /**\n   * 处理单元格点击\n   * @param dayOfWeek 星期（0-6）\n   * @param hour 小时\n   * @param minute 分钟\n   */
    handleCellClick(dayOfWeek: number, hour: number, minute: number): void;
    /**
     * 处理拖动开始
     * @param dayOfWeek 星期（0-6）
     * @param hour 小时
     * @param minute 分钟
     */
    handleDragStart(dayOfWeek: number, hour: number, minute: number): void;
    /**
     * 处理拖动移动
     * @param dayOfWeek 星期（0-6）
     * @param hour 小时
     * @param minute 分钟
     */
    handleDragMove(dayOfWeek: number, hour: number, minute: number): void;
    /**
     * 处理拖动结束
     */
    handleDragEnd(): void;
    /**
     * 更新拖动选择
     */
    private updateDragSelection;
    /**
     * 设置临时范围状态
     * @param dayOfWeek 星期（0-6）
     * @param startHour 开始小时
     * @param startTotalMinutes 开始时间（分钟数）
     * @param endHour 结束小时
     * @param endTotalMinutes 结束时间（分钟数）
     */
    private setTempRangeState;
    /**
     * 将时间转换为分钟数
     * @param hour 小时
     * @param minute 分钟
     * @returns 分钟数
     */
    private timeToMinutes;
    /**
     * 设置选中的时间范围
     * @param ranges 时间范围数组
     */
    setSelectedRanges(ranges: TimeRange[]): void;
    /**
     * 获取选中的时间范围
     * @returns 时间范围数组
     */
    getSelectedRanges(): TimeRange[];
    /**
     * 清除所有选中
     */
    clearSelection(): void;
    /**
     * 触发状态变更回调
     */
    private triggerChangeCallback;
    /**
     * 设置状态变更回调函数
     * @param callback 回调函数
     */
    setOnChangeCallback(callback: (ranges: TimeRange[]) => void): void;
    /**
     * 获取状态管理实例（用于调试）
     * @returns 状态管理实例
     */
    getState(): WeekTimeGridState;
}
//# sourceMappingURL=WeekTimeGridCore.d.ts.map