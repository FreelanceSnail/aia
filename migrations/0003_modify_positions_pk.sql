-- 重建 positions 表，修改主键为(symbol, type, account, portfolio)
-- 重命名旧表
ALTER TABLE positions RENAME TO positions_old;

-- 创建新表
CREATE TABLE IF NOT EXISTS positions (
  symbol TEXT,
  name TEXT,
  type TEXT,
  price REAL,
  preclose REAL,
  account TEXT,
  portfolio TEXT,
  quantity REAL,
  cost_price REAL,
  exchange TEXT,
  margin_ratio REAL,
  point_value REAL,
  target_symbol TEXT REFERENCES target_symbols(symbol),
  updated_at TEXT,
  market_value_rate REAL,
  equalled_market_value_rate REAL,
  market_value REAL,
  equalled_market_value REAL,
  style TEXT,
  cost REAL,
  delta REAL,
  profit REAL,
  daily_profit REAL,
  trade_date TEXT,
  PRIMARY KEY (symbol, type, account, portfolio)
) WITHOUT ROWID;

-- 迁移数据
INSERT INTO positions (symbol, name, type, price, preclose, account, portfolio, quantity, cost_price, exchange, margin_ratio, point_value, target_symbol, updated_at, market_value_rate, equalled_market_value_rate, market_value, equalled_market_value, style, cost, delta, profit, daily_profit, trade_date)
SELECT symbol, name, type, price, preclose, account, portfolio, quantity, cost_price, exchange, margin_ratio, point_value, target_symbol, updated_at, market_value_rate, equalled_market_value_rate, market_value, equalled_market_value, style, cost, delta, profit, daily_profit, trade_date
FROM positions_old;

-- 删除旧表
DROP TABLE positions_old;
