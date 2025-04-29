import csv
import sys
from typing import List

# 配置输出 SQL 文件名和表结构
CSV_FILE = 'positions.csv'
SQL_FILE = 'import_positions.sql'
TABLE_NAME = 'positions'

# 需要输出的字段顺序（与数据库 schema 对齐）
COLUMNS = [
    'id', 'symbol', 'name', 'type', 'current_price', 'preclose_price', 'account', 'portfolio', 'quantity', 'avg_price',
    'exchange', 'margin_ratio', 'point_value', 'target_symbol', 'updated_at', 'market_value_rate',
    'equalled_market_value_rate', 'market_value', 'equalled_market_value', 'style', 'cost', 'delta', 'profit', 'daily_profit'
]

# 需要格式化为四位小数的字段
FOUR_DECIMAL_FIELDS = {'current_price', 'preclose_price', 'avg_price'}
# 需要格式化为两位小数的字段
TWO_DECIMAL_FIELDS = {
    'quantity', 'margin_ratio', 'point_value', 'market_value_rate', 'equalled_market_value_rate',
    'market_value', 'equalled_market_value', 'cost', 'delta', 'profit', 'daily_profit'
}

def format_value(col: str, val: str):
    if val == '' or val.lower() == 'null':
        return 'NULL'
    if col in FOUR_DECIMAL_FIELDS:
        try:
            return f"{float(val):.4f}"
        except Exception:
            return 'NULL'
    if col in TWO_DECIMAL_FIELDS:
        try:
            return f"{float(val):.2f}"
        except Exception:
            return 'NULL'
    if col in ['id']:
        return str(int(float(val)))
    if col.startswith('updated_at'):
        return f"'{val}'"
    if col in ['symbol', 'name', 'type', 'account', 'portfolio', 'exchange', 'target_symbol', 'style']:
        return f"'{val}'"
    return val

def load_valid_target_symbols():
    valid_symbols = set()
    with open('target_symbols.csv', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            symbol = row.get('symbol', '').strip()
            if symbol:
                valid_symbols.add(symbol)
    return valid_symbols

def main():
    valid_target_symbols = load_valid_target_symbols()
    with open(CSV_FILE, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    sql_lines = [
        f"-- 下面为 positions.csv 的全部数据自动生成的 SQL 插入语句",
        f"INSERT INTO {TABLE_NAME} (\n  {', '.join(COLUMNS)}\n) VALUES"
    ]
    values_lines: List[str] = []

    for row in rows:
        vals = []
        for col in COLUMNS:
            val = row.get(col, '')
            # 只保留 target_symbol 在 target_symbols.csv 中的，否则赋 NULL
            if col == 'target_symbol':
                if val not in valid_target_symbols:
                    val = ''
            vals.append(format_value(col, val))
        values_lines.append(f"({', '.join(vals)})")
    
    sql_lines.append(',\n'.join(values_lines) + ';')

    with open(SQL_FILE, 'w', encoding='utf-8') as f:
        for line in sql_lines:
            f.write(line + '\n')
    print(f"SQL 文件已生成: {SQL_FILE}")

if __name__ == '__main__':
    main()
