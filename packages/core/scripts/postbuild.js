import { rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = resolve(__dirname, '../dist');

// 删除 __tests__ 目录
const testsDir = resolve(distDir, '__tests__');
try {
  rmSync(testsDir, { recursive: true, force: true });
  console.log('Deleted __tests__ directory from dist');
} catch (err) {
  console.error('Failed to delete __tests__ directory:', err.message);
}