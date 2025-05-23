// node --test src/__tests__/index.node.test.js
// debug: node --test --trace-warnings src/__tests__/index.node.test.js
import { test } from 'node:test';
import { getQuote } from '../tushareQuote.js';
import { loadTushareToken } from './test.util.js';

test('Integration: /api/refresh updates positions', async () => {
  const tushareToken = loadTushareToken();
  const symbolsWithType = [
    {symbol:"518880.SH",type:"etflof"},
    {symbol:"AG2509.SHF",type:"future"},
    {symbol:"IC2509.CFX",type:"future"},
    {symbol:"M2603.DCE",type:"future"},
    {symbol:"021177.OF",type:"fund"},
    {symbol:"008114.OF",type:"fund"},
    {symbol:"007937.OF",type:"fund"},
    {symbol:"003318.OF",type:"fund"},
    {symbol:"008928.OF",type:"fund"},
    {symbol:"AU.SHF",type:"future"},
    {symbol:"008817.OF",type:"fund"},
    {symbol:"017837.OF",type:"fund"},
    {symbol:"161716.SZ",type:"fund"},
    {symbol:"968103.HKOF",type:""},
    {symbol:"SVXY",type:"us_stock"},
    {symbol:"SLV",type:"us_stock"},
    {symbol:"217022.OF",type:"fund"},
  ];
  const updates = [];
  for (const item of symbolsWithType) {
    const { symbol, type } = item;
    const quote = await getQuote(symbol, type, tushareToken);
    if (quote) {
      updates.push(`UPDATE positions SET price = ${quote.price}, preclose = ${quote.preclose}, updated_at = '${new Date().toISOString()}' WHERE symbol = '${symbol}';`);
    }
  }
  console.log(updates.join('\n'));
});
