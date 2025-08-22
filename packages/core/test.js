
import { WeekTimeGridCore } from './src/index';

// 创建一个简单的测试
const core = new WeekTimeGridCore({ timeInterval: 60 });
core.handleCellClick(0, 8, 0); // 点击周一 8:00 的单元格
const ranges = core.getSelectedRanges();
console.log('Single cell selection:', ranges);

// 测试拖动选择
const core2 = new WeekTimeGridCore({ timeInterval: 60 });
core2.handleDragStart(0, 8, 0);
core2.handleDragMove(0, 12, 0);
core2.handleDragEnd();
const ranges2 = core2.getSelectedRanges();
console.log('Drag selection (8-12):', ranges2);

