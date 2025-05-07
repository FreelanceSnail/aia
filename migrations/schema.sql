-- target_symbols 表
CREATE TABLE IF NOT EXISTS target_symbols (
  symbol TEXT PRIMARY KEY,
  name TEXT,
  type TEXT,
  current_price REAL,
  percentage_change REAL
);

-- positions 表
CREATE TABLE IF NOT EXISTS positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  target_symbol TEXT,
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
  FOREIGN KEY (target_symbol) REFERENCES target_symbols(symbol)
);
