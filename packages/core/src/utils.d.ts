/**
 * 格式化时间
 * @param hour 小时
 * @param minute 分钟
 * @param secondMinute 可选的第二个分钟值（用于覆盖minute）
 * @returns 格式化的时间字符串 "HH:MM"
 */
export declare function formatTime(hour: number, minute: number, secondMinute?: number): string;
/**
 * 解析时间字符串
 * @param timeStr 时间字符串，格式为 "HH:MM"
 * @returns 解析后的时间对象，或null（如果解析失败）
 */
export declare function parseTime(timeStr: string): {
    hour: number;
    minute: number;
} | null;
/**
 * 合并重叠的时间范围
 * @param ranges 时间范围数组
 * @returns 合并后的时间范围数组
 */
export declare function mergeOverlappingRanges<T extends {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}>(ranges: T[]): T[];
/**
 * 计算两个时间之间的分钟数
 * @param startTime 开始时间字符串，格式为 "HH:MM"
 * @param endTime 结束时间字符串，格式为 "HH:MM"
 * @returns 分钟数，如果解析失败则返回0
 */
export declare function calculateMinutesBetween(startTime: string, endTime: string): number;
//# sourceMappingURL=utils.d.ts.map