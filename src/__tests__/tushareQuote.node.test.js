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
  '000001.SH', // 指数代码，测试 indice 分支
  '000001.SZ', // 股票代码，测试 stock 分支
  'AU.SHF', // 商品期货代码，测试 future 分支
  'IC2512.CFX', // 股指期货代码，测试 future 分支
  'IO2509-C-3800.CFX', // 股指期权代码，测试 option 分支
  '10008809.SH', // 交易所期权代码，测试 option 分支
  '518880.SH' // 场内基金代码，测试 etflof 分支
];

for (const symbol of symbols) {
  test(`getQuote ST测试: 应能从网络获取 ${symbol} 的行情数据`, async (t) => {
    const tushareToken = loadTushareToken();
    const result = await getQuote(symbol, tushareToken);
    console.log(`getQuote result for ${symbol}:`, result);
    assert.ok(result);
    assert.equal(result.ts_code, symbol);
  });
}

// 以下为无效代码测试
test('getQuote 对于无效代码返回 null', async (t) => {
  const result = await getQuote('INVALID_SYMBOL', 'dummy-token');
  assert.equal(result, null);
});

test('getQuote 对于美股代码返回 null', async (t) => {
  const result = await getQuote('AAPL', 'dummy-token');
  assert.equal(result, null);
});
