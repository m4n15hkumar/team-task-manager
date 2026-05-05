import { readFileSync } from 'fs';
import { parse } from '@babel/parser';

try {
  const code = readFileSync('./src/pages/MyTasks.jsx', 'utf8');
  parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log('Parse successful!');
} catch (e) {
  console.error('Parse error:', e);
}
