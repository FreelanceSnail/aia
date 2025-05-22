// node --test src/__tests__/index.node.test.js
// debug: node --test --trace-warnings src/__tests__/index.node.test.js
import { test } from 'node:test';
import { getQuote, loadTushareToken } from '../tushareQuote.js';

test('Integration: /api/refresh updates positions', async () => {
  const tushareToken = loadTushareToken();
  const symbols = [
    "518880.SH",
    "AG2506.SHF",
    "IC2506.CFX",
    "M2505.DCE",
    "021177.OF",
    "008114.OF",
    "007937.OF",
    "003318.OF",
    "008928.OF",
    "AU.SHF",
    "008817.OF",
    "017837.OF",
    "161716.SZ",
    "968103.HKOF",
    "SVXY",
    "SLV",
    "217022.OF",
  ];
  const updates = [];
  for (const symbol of symbols) {
    const quote = await getQuote(symbol, tushareToken);
    if (quote) {
      updates.push(`UPDATE positions SET price = ${quote.price}, preclose = ${quote.preclose}, updated_at = '${new Date().toISOString()}' WHERE symbol = '${symbol}';`);
    }
  }
  console.log(updates.join('\n'));
});
