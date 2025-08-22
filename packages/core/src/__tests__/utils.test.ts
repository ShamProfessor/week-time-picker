import { describe, it, expect, vi } from 'vitest';
import { formatTime, parseTime, mergeOverlappingRanges, calculateMinutesBetween } from '../utils';

describe('Utils', () => {
  describe('formatTime', () => {
    it('should format time correctly', () => {
      expect(formatTime(9, 0)).toBe('09:00');
      expect(formatTime(12, 30)).toBe('12:30');
      expect(formatTime(0, 5)).toBe('00:05');
      expect(formatTime(23, 59)).toBe('23:59');
    });
    
    it('should handle second minute parameter', () => {
      expect(formatTime(9, 0, 15)).toBe('09:15');
      expect(formatTime(12, 30, 45)).toBe('12:45');
    });
  });
  
  describe('parseTime', () => {
    it('should parse valid time strings', () => {
      expect(parseTime('09:00')).toEqual({ hour: 9, minute: 0 });
      expect(parseTime('12:30')).toEqual({ hour: 12, minute: 30 });
      expect(parseTime('00:05')).toEqual({ hour: 0, minute: 5 });
      expect(parseTime('23:59')).toEqual({ hour: 23, minute: 59 });
    });
    
    it('should return null for invalid time strings', () => {
      expect(parseTime('invalid')).toBeNull();
      expect(parseTime('25:00')).toBeNull();
      expect(parseTime('12:60')).toBeNull();
      expect(parseTime('12')).toBeNull();
      expect(parseTime('')).toBeNull();
    });
  });
  
  describe('mergeOverlappingRanges', () => {
    it('should merge overlapping ranges', () => {
      const ranges = [
        { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' },
        { dayOfWeek: 1, startTime: '10:00', endTime: '12:00' },
        { dayOfWeek: 2, startTime: '14:00', endTime: '16:00' },
        { dayOfWeek: 2, startTime: '16:00', endTime: '18:00' }
      ];
      
      const merged = mergeOverlappingRanges(ranges);
      
      expect(merged).toHaveLength(2);
      expect(merged[0]).toEqual({ dayOfWeek: 1, startTime: '09:00', endTime: '12:00' });
      expect(merged[1]).toEqual({ dayOfWeek: 2, startTime: '14:00', endTime: '18:00' });
    });
    
    it('should not merge non-overlapping ranges', () => {
      const ranges = [
        { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' },
        { dayOfWeek: 1, startTime: '12:00', endTime: '14:00' },
        { dayOfWeek: 2, startTime: '10:00', endTime: '12:00' }
      ];
      
      const merged = mergeOverlappingRanges(ranges);
      
      expect(merged).toHaveLength(3);
      expect(merged).toEqual(expect.arrayContaining([
        { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' },
        { dayOfWeek: 1, startTime: '12:00', endTime: '14:00' },
        { dayOfWeek: 2, startTime: '10:00', endTime: '12:00' }
      ]));
    });
    
    it('should handle empty array', () => {
      expect(mergeOverlappingRanges([])).toEqual([]);
    });
    
    it('should handle single range', () => {
      const range = { dayOfWeek: 1, startTime: '09:00', endTime: '11:00' };
      expect(mergeOverlappingRanges([range])).toEqual([range]);
    });
  });
  
  describe('calculateMinutesBetween', () => {
    it('should calculate minutes between two times', () => {
      expect(calculateMinutesBetween('09:00', '10:00')).toBe(60);
      expect(calculateMinutesBetween('09:00', '09:30')).toBe(30);
      expect(calculateMinutesBetween('09:00', '11:15')).toBe(135);
      expect(calculateMinutesBetween('23:00', '23:59')).toBe(59);
    });
    
    it('should return 0 for invalid times', () => {
      expect(calculateMinutesBetween('invalid', '10:00')).toBe(0);
      expect(calculateMinutesBetween('09:00', 'invalid')).toBe(0);
      expect(calculateMinutesBetween('', '')).toBe(0);
    });
    
    it('should return 0 if end time is before start time', () => {
      expect(calculateMinutesBetween('10:00', '09:00')).toBe(0);
    });
  });
});