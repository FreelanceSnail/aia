import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getQuote } from './tushareQuote.js';
// Cloudflare D1 数据库通过 c.env.DB 访问
const app = new Hono();

// 配置 CORS
const allowedOrigins = [
  'http://localhost:4000',
  'http://127.0.0.1:4000',
  'https://freelancesnail.github.io',
  'https://snail-cafe.cn',
  'https://freelancesnail-github-io.pages.dev'
];

app.use('*', cors({
  origin: (origin, c) => {
    if (origin && allowedOrigins.includes(origin)) {
      return origin;
    }
    // 对于非浏览器请求（如 curl）或不允许的来源，不返回 Access-Control-Allow-Origin
    // 或者你可以返回一个默认的允许来源，但这通常不推荐
    return undefined; // 或者根据你的策略返回 null 或特定来源
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'], // 允许的方法
  allowHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  credentials: true, // 如果需要携带凭证（例如 cookies）
  maxAge: 86400, // 预检请求的缓存时间（秒）
}));

// 处理 OPTIONS 预检请求 (Hono 的 cors 中间件通常会自动处理，但显式添加以确保)
app.options('*', (c) => {
  // cors 中间件已处理，这里返回一个空响应即可
  return c.text('', 204);
});

// 首页路由：显示所有 API 路由说明
app.get('/', (c) =>
  c.json({
    message: 'API 服务已启动',
    routes: [
      { method: 'GET', path: '/api/positions/summary', description: '简要持仓数据' },
      { method: 'GET', path: '/api/positions/detail', description: '详细持仓数据' },
      { method: 'GET', path: '/api/indicators', description: '量化技术指标（示例，返回空数组或 mock 数据）' },
      { method: 'POST', path: '/api/refresh', description: '行情刷新（示例，实际应接入行情刷新逻辑）' }
    ]
  })
);

// 简要持仓数据
app.get('/api/positions/summary', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT symbol, name, type, portfolio, price, preclose, market_value_rate, equalled_market_value_rate, style
    FROM positions
    ORDER BY portfolio DESC
  `).all();
  return c.json(results);
});

// 详细持仓数据 (需要密码验证)
app.all('/api/positions/detail', async (c) => {
  const expectedPassword = c.env.API_PASSWORD; // 从环境变量获取密码
  let providedPassword = null;

  if (!expectedPassword) {
    console.error('API_PASSWORD environment variable not set.');
    return c.json({ error: '服务器配置错误' }, 500); // 不暴露具体错误给客户端
  }

  if (c.req.method === 'GET') {
    providedPassword = c.req.query('password');
  } else if (c.req.method === 'POST') {
    try {
      const body = await c.req.json();
      providedPassword = body.password;
    } catch (e) {
      // 如果请求体不是 JSON 或解析失败，密码将为 null
      console.error('Failed to parse POST body for password:', e);
    }
  }

  if (providedPassword && providedPassword === expectedPassword) {
    // 密码匹配，返回数据
    const { results } = await c.env.DB.prepare('SELECT * FROM positions ORDER BY portfolio DESC').all();
    return c.json(results);
  } else {
    // 密码不匹配或未提供
    return c.json({ error: '密码错误' }, 401);
  }
});

// 量化技术指标
app.all('/api/indicators', async (c) => {
  const data = {
    futures_discount: [
      { contract: "IF当月", spot: 4000, future: 3990, discount: -10, discount_rate: -0.25 },
      { contract: "IF次月", spot: 4000, future: 3985, discount: -15, discount_rate: -0.38 },
      { contract: "IF当季", spot: 4000, future: 3970, discount: -30, discount_rate: -0.75 },
      { contract: "IF次季", spot: 4000, future: 3960, discount: -40, discount_rate: -1.00 }
    ],
    index_ratio: {
      hs300: 4000,
      csi1000: 6000,
      ratio: 0.6667
    },
    risk_parity: [
      { asset: "股票", weight: 0.35 },
      { asset: "债券", weight: 0.40 },
      { asset: "商品", weight: 0.15 },
      { asset: "黄金", weight: 0.10 }
    ],
    momentum_etf: [
      { code: "510300", name: "沪深300ETF", chg21: 2.1, chg22: 2.3, chg23: 2.5, chg24: 2.8 },
      { code: "159919", name: "中证500ETF", chg21: 1.8, chg22: 2.0, chg23: 2.2, chg24: 2.4 },
      { code: "512100", name: "中证1000ETF", chg21: 2.9, chg22: 3.1, chg23: 3.0, chg24: 2.7 }
    ]
  };
  return c.json(data);
});

// 行情刷新
app.all('/api/refresh', async (c) => {
  const outputs = [];
  const tushareToken = c.env.API_TUSHARE_TOKEN;
  if (!tushareToken) {
    return c.json({ status: 'error', message: 'Tushare token not found in environment variables' }, 500);
  }
  const result = await c.env.DB.prepare('SELECT DISTINCT symbol FROM positions WHERE symbol != "cash"').all();
  const symbols = result.results.map(r => r.symbol);
  outputs.push(`Refreshing ${symbols.length} symbols...`);
  for (const symbol of symbols) {
    const quote = await getQuote(symbol, tushareToken);
    if (quote) {
      await c.env.DB
        .prepare(
          'UPDATE positions SET price = ?, preclose = ?, updated_at = ? WHERE symbol = ?'
        )
        .bind(
          quote.price,
          quote.preclose,
          new Date().toISOString(),
          symbol
        )
        .run();
      outputs.push(`Updated ${symbol}: price=${quote.price}, preclose=${quote.preclose}, trade_date=${quote.trade_date}`);
    }
  }
  return c.json({ status: 'ok', refreshed_at: new Date().toISOString(), output: outputs });
});

export default app;
