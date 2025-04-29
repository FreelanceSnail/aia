import { Hono } from 'hono';

// Cloudflare D1 数据库通过 c.env.DB 访问
const app = new Hono();

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
    SELECT symbol, name, type, quantity, market_value, profit, daily_profit, portfolio, account, updated_at
    FROM positions
    ORDER BY updated_at DESC
  `).all();
  return c.json(results);
});

// 详细持仓数据
app.get('/api/positions/detail', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM positions ORDER BY updated_at DESC').all();
  return c.json(results);
});

// 量化技术指标（示例，返回空数组或 mock 数据）
app.get('/api/indicators', async (c) => {
  // TODO: 实际指标逻辑
  return c.json([]);
});

// 行情刷新（示例，实际应接入行情刷新逻辑）
app.post('/api/refresh', async (c) => {
  // TODO: 实际刷新逻辑
  return c.json({ status: 'ok', refreshed_at: new Date().toISOString() });
});

export default app;
