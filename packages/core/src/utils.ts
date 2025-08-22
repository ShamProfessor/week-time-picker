/**
 * 格式化时间
 * @param hour 小时
 * @param minute 分钟
 * @param secondMinute 可选的第二个分钟值（用于覆盖minute）
 * @returns 格式化的时间字符串 "HH:MM"
 */
export function formatTime(
  hour: number,
  minute: number,
  secondMinute?: number
): string {
  const h = hour.toString().padStart(2, "0");
  const m = (secondMinute !== undefined ? secondMinute : minute)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * 解析时间字符串
 * @param timeStr 时间字符串，格式为 "HH:MM"
 * @returns 解析后的时间对象，或null（如果解析失败）
 */
export function parseTime(
  timeStr: string
): { hour: number; minute: number } | null {
  const regex = /^(\d{1,2}):(\d{1,2})$/;
  const match = timeStr.match(regex);

  if (!match) return null;

  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);

  // 验证时间有效性
  if (
    isNaN(hour) ||
    isNaN(minute) ||
    hour < 0 ||
    hour > 24 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return { hour, minute };
}

/**
 * 合并重叠的时间范围
 * @param ranges 时间范围数组
 * @returns 合并后的时间范围数组
 */
export function mergeOverlappingRanges<
  T extends { dayOfWeek: number; startTime: string; endTime: string }
>(ranges: T[]): T[] {
  if (ranges.length <= 1) return [...ranges];

  // 按天分组
  const rangesByDay: { [key: number]: T[] } = {};

  ranges.forEach((range) => {
    const day = range.dayOfWeek;
    if (!rangesByDay[day]) {
      rangesByDay[day] = [];
    }
    rangesByDay[day].push({ ...range });
  });

  // 处理每一天的范围
  const result: T[] = [];

  Object.keys(rangesByDay).forEach((dayKey) => {
    const day = parseInt(dayKey, 10);
    const dayRanges = rangesByDay[day];

    // 按开始时间排序
    dayRanges.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });

    // 合并重叠的范围
    const mergedRanges: T[] = [];
    let currentRange: T | null = null;

    dayRanges.forEach((range) => {
      if (!currentRange) {
        currentRange = { ...range };
        return;
      }

      const currentEndTime = parseTime(currentRange.endTime);
      const nextStartTime = parseTime(range.startTime);

      if (!currentEndTime || !nextStartTime) return;

      // 转换为分钟进行比较
      const currentEndMinutes =
        currentEndTime.hour * 60 + currentEndTime.minute;
      const nextStartMinutes = nextStartTime.hour * 60 + nextStartTime.minute;

      // 如果当前范围的结束时间大于等于下一个范围的开始时间，则合并
      if (currentEndMinutes >= nextStartMinutes) {
        // 取两个结束时间中的较大者
        const currentEndTimeObj = parseTime(currentRange.endTime);
        const nextEndTimeObj = parseTime(range.endTime);

        if (currentEndTimeObj && nextEndTimeObj) {
          const currentEndMinutes =
            currentEndTimeObj.hour * 60 + currentEndTimeObj.minute;
          const nextEndMinutes =
            nextEndTimeObj.hour * 60 + nextEndTimeObj.minute;

          if (nextEndMinutes > currentEndMinutes) {
            currentRange.endTime = range.endTime;
          }
        }
      } else {
        // 不重叠，添加当前范围并开始新的范围
        mergedRanges.push(currentRange);
        currentRange = { ...range };
      }
    });

    // 添加最后一个范围
    if (currentRange) {
      mergedRanges.push(currentRange);
    }

    // 添加到结果中
    result.push(...mergedRanges);
  });

  return result;
}

/**
 * 计算两个时间之间的分钟数
 * @param startTime 开始时间字符串，格式为 "HH:MM"
 * @param endTime 结束时间字符串，格式为 "HH:MM"
 * @returns 分钟数，如果解析失败则返回0
 */
export function calculateMinutesBetween(
  startTime: string,
  endTime: string
): number {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (!start || !end) return 0;

  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;

  return Math.max(0, endMinutes - startMinutes);
}
