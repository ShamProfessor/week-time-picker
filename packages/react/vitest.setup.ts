import '@testing-library/jest-dom';

// 添加全局模拟
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};