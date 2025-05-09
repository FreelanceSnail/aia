// 运行本集成测试命令：
// node --test src/__tests__/tushareQuote.node.test.js

import { test } from 'node:test';
import assert from 'assert';
import { getQuote } from '../tushareQuote.js';
import fs from 'fs';
import path from 'path';

// 读取 .dev.vars 文件中的 API_TUSHARE_TOKEN
function loadTushareToken() {
  const envPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../.dev.vars');
  if (!fs.existsSync(envPath)) {
    throw new Error(`未找到 .dev.vars 文件: ${envPath}`);
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  const match = content.match(/^API_TUSHARE_TOKEN="?([^"]+)"?/m);
  if (!match) {
    throw new Error('未在 .dev.vars 文件中找到 API_TUSHARE_TOKEN');
  }
  return match[1];
}

const symbols = [
  '000001.SZ',
  'AU.SHF',
  'IC2512.CFX',
  'IO2509-C-3800.CFX',
];

for (const symbol of symbols) {
  test(`getQuote 网络集成测试: 应能从网络获取 ${symbol} 的行情数据`, async (t) => {
    const tushareToken = loadTushareToken();
    const result = await getQuote(symbol, tushareToken);
    console.log(`getQuote result for ${symbol}:`, result);
    assert.ok(result);
    assert.equal(result.ts_code, symbol);
  });
}

