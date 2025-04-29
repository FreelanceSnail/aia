# Investment API (Cloudflare Worker + D1)

## 功能
- 获取简要/详细持仓数据
- 获取量化技术指标（可扩展）
- 触发行情刷新

## 目录结构
- `src/index.ts`：Cloudflare Worker 入口与 API 路由
- `src/schema.sql`：D1 数据库表结构
- `wrangler.toml`：Cloudflare Worker 配置
- `package.json`：依赖与脚本

## 本地开发
1. 安装依赖：`npm install`
2. 初始化 D1 数据库：
   ```
   wrangler d1 execute investment_db --file=src/schema.sql
   ```
3. 启动开发服务器：
   ```
   npm run dev
   ```

## 部署
```
npm run deploy
```

---
如需扩展 API 或表结构，请修改 `src/index.ts` 和 `src/schema.sql`。
