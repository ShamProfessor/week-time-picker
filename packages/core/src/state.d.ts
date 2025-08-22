import { CellState, TimeRange, WeekTimeGridOptions } from "./types";
/**
 * 周时间网格状态管理类
 */
export declare class WeekTimeGridState {
    /** 网格状态（二维数组） */
    private gridState;
    /** 当前选中的时间范围 */
    private selectedRanges;
    /** 配置选项 */
    private options;
    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options?: WeekTimeGridOptions);
    /**
     * 初始化网格状态
     */
    initializeGrid(): void;
    /**
     * 更新单个单元格状态（不重新计算时间范围）
     * @param dayOfWeek 星期（0-6）
     * @param hour 小时
     * @param minute 分钟
     * @param selected 是否选中
     */
    updateSingleCell(dayOfWeek: number, hour: number, minute: number, selected: boolean): void;
    /**
     * 更新单元格状态
     * @param dayOfWeek 星期（0-6）
     * @param hour 小时
     * @param minute 分钟
     * @param selected 是否选中
     */
    updateCell(dayOfWeek: number, hour: number, minute: number, selected: boolean): void;
    /**
     * 查找单元格
     * @param dayOfWeek 星期（0-6）
     * @param hour 小时
     * @param minute 分钟
     * @returns 单元格状态或undefined
     */
    private findCell;
    /**
     * 获取单元格状态
     * @param dayOfWeek 星期（0-6）
     * @param hour 小时
     * @param minute 分钟
     * @returns 是否选中
     */
    getCellState(dayOfWeek: number, hour: number, minute: number): boolean;
    /**
     * 获取网格状态
     * @returns 网格状态二维数组
     */
    getGridState(): CellState[][];
    /**
     * 获取选中的时间范围
     * @returns 时间范围数组
     */
    getSelectedRanges(): TimeRange[];
    /**
     * 设置选中的时间范围
     * @param ranges 时间范围数组
     */
    setSelectedRanges(ranges: TimeRange[]): void;
    /**
     * 设置时间范围的选中状态
     * @param dayOfWeek 星期（0-6）
     * @param startTime 开始时间对象
     * @param endTime 结束时间对象
     * @param selected 是否选中
     */
    private setTimeRangeSelected;
    /**
     * 清除所有选中
     */
    clearSelection(): void;
    /**
     * 更新选中的时间范围
     */
    private updateSelectedRanges;
    /**
     * 添加时间范围
     * @param startCell 开始单元格
     * @param endCell 结束单元格
     */
    private addTimeRange;
    /**
     * 获取配置选项
     * @returns 配置选项
     */
    getOptions(): Required<WeekTimeGridOptions>;
}
//# sourceMappingURL=state.d.ts.map