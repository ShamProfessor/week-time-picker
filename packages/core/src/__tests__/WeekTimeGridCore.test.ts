import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WeekTimeGridCore, TimeRange } from '../index';

describe('WeekTimeGridCore', () => {
  let core: WeekTimeGridCore;
  let onChangeMock: (ranges: TimeRange[]) => void;
  
  beforeEach(() => {
    onChangeMock = vi.fn();
    core = new WeekTimeGridCore({}, onChangeMock);
  });
  
  it('should initialize with default options', () => {
    const config = core.getGridConfig();
    expect(config.rows).toBe(7);
    expect(config.dayLabels).toHaveLength(7);
    expect(config.hourLabels).toBeDefined();
  });
  
  it('should handle cell click', () => {
    // 初始状态应该是未选中
    expect(core.getCellState(0, 10, 0)).toBe(false);
    
    // 点击单元格
    core.handleCellClick(0, 10, 0);
    
    // 状态应该变为选中
    expect(core.getCellState(0, 10, 0)).toBe(true);
    
    // 再次点击
    core.handleCellClick(0, 10, 0);
    
    // 状态应该变回未选中
    expect(core.getCellState(0, 10, 0)).toBe(false);
  });
  
  it('should handle drag selection', () => {
    // 开始拖动
    core.handleDragStart(0, 10, 0);
    
    // 移动到另一个单元格
    core.handleDragMove(0, 12, 0);
    
    // 检查临时状态
    expect(core.getCellState(0, 10, 0)).toBe(true);
    expect(core.getCellState(0, 11, 0)).toBe(true);
    expect(core.getCellState(0, 12, 0)).toBe(true); // 12:00单元格应该被选中
    
    // 结束拖动
    core.handleDragEnd();
    
    // 检查最终状态
    expect(core.getCellState(0, 10, 0)).toBe(true);
    expect(core.getCellState(0, 11, 0)).toBe(true);
    expect(core.getCellState(0, 12, 0)).toBe(true); // 12:00单元格应该被选中
    
    // 获取选中的时间范围
    const ranges = core.getSelectedRanges();
    expect(ranges).toHaveLength(1);
    expect(ranges[0].dayOfWeek).toBe(0);
    expect(ranges[0].startTime).toBe('10:00');
    expect(ranges[0].endTime).toBe('13:00'); // 结束时间应该是13:00，因为12:00被包含在内
  });
  
  it('should set selected ranges', () => {
    const ranges: TimeRange[] = [
      { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '17:00' }
    ];
    
    core.setSelectedRanges(ranges);
    
    // 检查状态
    expect(core.getCellState(1, 9, 0)).toBe(true);
    expect(core.getCellState(1, 10, 0)).toBe(true);
    expect(core.getCellState(1, 11, 0)).toBe(true);
    expect(core.getCellState(3, 14, 0)).toBe(true);
    expect(core.getCellState(3, 15, 0)).toBe(true);
    expect(core.getCellState(3, 16, 0)).toBe(true);
    
    // 获取选中的时间范围
    const selectedRanges = core.getSelectedRanges();
    expect(selectedRanges).toHaveLength(2);
  });
  
  it('should clear selection', () => {
    // 先设置一些选中的范围
    const ranges: TimeRange[] = [
      { dayOfWeek: 1, startTime: '09:00', endTime: '12:00' }
    ];
    
    core.setSelectedRanges(ranges);
    expect(core.getCellState(1, 9, 0)).toBe(true);
    
    // 清除选中
    core.clearSelection();
    
    // 检查状态
    expect(core.getCellState(1, 9, 0)).toBe(false);
    
    // 获取选中的时间范围
    const selectedRanges = core.getSelectedRanges();
    expect(selectedRanges).toHaveLength(0);
  });
});