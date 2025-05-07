# AIA API (Cloudflare Worker + D1)

## 功能
- 获取简要/详细持仓数据
- 获取量化技术指标（可扩展）
- 触发行情刷新

## 目录结构
- `src/index.js`：Cloudflare Worker 入口与 API 路由
- `migrations/schema.sql`：D1 数据库表结构
- `wrangler.toml`：Cloudflare Worker 配置
- `package.json`：依赖与脚本

## 本地开发
1. 安装依赖：`npm install`
2. 初始化 D1 数据库：
   ```
   npx wrangler d1 migrations apply aia_db
   # 导入示例数据
   npx wrangler d1 execute aia_db --file=samples/import_target_symbols.sql
   npx wrangler d1 execute aia_db --file=samples/import_positions.sql
   ```
3. 启动开发服务器：`npx wrangler dev`
   

## 部署
```
push到origin/master分支上触发自动部署
```

---

