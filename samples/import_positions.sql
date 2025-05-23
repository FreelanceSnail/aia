-- 下面为 positions.csv 的全部数据自动生成的 SQL 插入语句
INSERT INTO positions (
  id, symbol, name, type, price, preclose, account, portfolio, quantity, cost_price, exchange, margin_ratio, point_value, target_symbol, updated_at, market_value_rate, equalled_market_value_rate, market_value, equalled_market_value, style, cost, delta, profit, daily_profit
) VALUES
(1, '518880.SH', '黄金ETF', 'etf', 7.3240, 7.3270, '国信证券', '动量轮动策略', 73700.00, 6.7788, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.12, 0.07, 539778.80, 539778.80, '贵金属', 499597.56, 1.00, 40181.24, -221.10),
(2, 'cash', '国信证券余额', 'cash', 1.0000, 1.0000, '国信证券', '动量轮动策略', 410.92, 1.0000, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.00, 0.00, 410.92, 410.92, '现金', 410.92, 1.00, 0.00, 0.00),
(3, '518880.SH', '黄金ETF', 'etf', 7.3240, 7.3270, '华泰证券', '动量轮动策略', 73100.00, 6.7810, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.12, 0.07, 535384.40, 535384.40, '贵金属', 495691.10, 1.00, 39693.30, -219.30),
(4, 'cash', '华泰证券余额', 'cash', 1.0000, 1.0000, '华泰证券', '动量轮动策略', 198.00, 1.0000, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.00, 0.00, 198.00, 198.00, '现金', 198.00, 1.00, 0.00, 0.00),
(5, 'AG2506.SHF', '白银期货2506', 'future', 8146.0000, 8094.0000, '瑞达期货', '金银轮动策略', 3.00, 7942.0000, '1.0', 0.13, 15.00, NULL, '2025-04-22 20:03:19', 0.01, 0.05, 55640.70, 366570.00, '贵金属', 46460.70, 1.00, 9180.00, 2340.00),
(6, 'IC2506.CFX', '中证500股指期货2506', 'future', 5437.4000, 5439.2000, '瑞达期货', 'ICIM轮动策略', 2.00, 5732.0000, '1.0', 0.12, 200.00, NULL, '2025-04-22 20:03:19', 0.03, 0.28, 157296.00, 2174960.00, '权益资产', 275136.00, 1.00, -117840.00, -720.00),
(7, 'M2505.DCE', '豆粕期货2505', 'future', 2934.0000, 2947.0000, '瑞达期货', '豆粕网格策略', 30.00, 2794.0000, '1.0', 0.07, 10.00, NULL, '2025-04-22 20:03:19', 0.02, 0.12, 100674.00, 880200.00, '农产品', 58674.00, 1.00, 42000.00, -3900.00),
(8, 'cash', '余额宝', 'cash', 1.0000, 1.0000, '支付宝', '风险平价资产配置', 5076.49, 1.0000, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.00, 0.00, 5076.49, 5076.49, '现金', 5076.49, 1.00, 0.00, 0.00),
(9, '021177', '摩根中证A50ETF联接A', 'fund', 1.0750, 1.0742, '支付宝', '风险平价资产配置', 291107.89, 1.0726, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.07, 0.04, 312940.98, 312940.98, '权益资产', 312242.32, 1.00, 698.66, 232.89),
(10, '008114', '天弘红利低波100ETF联接A', 'fund', 1.6454, 1.6387, '支付宝', '风险平价资产配置', 37980.90, 1.6554, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.01, 0.01, 62493.77, 62493.77, '权益资产', 62873.58, 1.00, -379.81, 254.47),
(11, '007937', '华夏豆粕ETF联接A', 'fund', 1.7862, 1.7734, '支付宝', '风险平价资产配置', 34259.20, 1.6404, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.01, 0.01, 61193.78, 61193.78, '农产品', 56198.79, 1.00, 4994.99, 438.52),
(12, '003318', '景顺长城500中性低波指数A', 'fund', 1.3873, 1.3772, '支付宝', '风险平价资产配置', 273422.26, 1.3114, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.08, 0.05, 379318.70, 379318.70, '权益资产', 358565.95, 1.00, 20752.75, 2761.56),
(13, '008928', '宏利消费红利指数A', 'fund', 1.5408, 1.5312, '支付宝', '风险平价资产配置', 142803.93, 1.4845, '1.0', 1.00, 1.00, 'H30094', '2025-04-22 20:03:19', 0.05, 0.03, 220032.30, 220032.30, '权益资产', 211992.43, 1.00, 8039.86, 1370.92),
(14, 'AU.SHF', '纸黄金', 'future', 759.2200, 762.6200, '招商银行', '个人养老基金', 19.09, 408.3300, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.00, 0.00, 14493.89, 14493.89, '贵金属', 7795.22, 1.00, 6698.67, -64.91),
(15, '008114', '天弘红利低波100ETF联接A', 'fund', 1.6454, 1.6387, '招商银行', '个人养老基金', 61356.62, 1.6533, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.02, 0.01, 100956.18, 100956.18, '权益资产', 101440.90, 1.00, -484.72, 411.09),
(16, '008817', '华宝可转债C', 'fund', 1.6072, 1.6059, '招商银行', '个人养老基金', 61127.25, 1.4833, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.02, 0.01, 98243.72, 98243.72, '债券', 90670.05, 1.00, 7573.67, 79.47),
(17, '017837', '博时中债7-10政金债A', 'fund', 1.1364, 1.1363, '招商银行', '个人养老基金', 80102.42, 1.1236, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.02, 0.01, 91028.39, 91028.39, '债券', 90003.08, 1.00, 1025.31, 8.01),
(18, '161716', '招商双债', 'fund', 1.6005, 1.6003, '招商银行', '个人养老基金', 95419.34, 1.5836, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.03, 0.02, 152718.65, 152718.65, '债券', 151106.07, 1.00, 1612.59, 19.08),
(19, '968103', '汇丰亚洲债券', 'fund', 9.5212, 9.5541, '招商银行', '个人养老基金', 10129.23, 9.8724, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.02, 0.01, 96442.42, 96442.42, '债券', 99999.81, 1.00, -3557.39, -333.25),
(20, 'cash', '微众银行现金', 'cash', 1.0000, 1.0000, '微众银行', 'ICIM轮动策略', 1321721.40, 1.0000, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.29, 0.17, 1321721.40, 1321721.40, '现金', 1321721.40, 1.00, 0.00, 0.00),
(21, 'cash', '富民银行现金', 'cash', 1.0000, 1.0000, '富民银行', 'ICIM轮动策略', 50000.00, 1.0000, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.01, 0.01, 50000.00, 50000.00, '现金', 50000.00, 1.00, 0.00, 0.00),
(22, 'SVXY', '恐慌指数0.5x做空ETF', 'us_stock', 35.9050, 34.6300, '雪盈证券', '境外资产管理', 335.00, 36.0743, '7.3', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.00, 0.00, 12028.17, 12028.18, '权益资产', 12084.89, 1.00, -56.72, 427.12),
(23, 'SLV', '白银ETF', 'us_stock', 29.2200, 29.1900, '雪盈证券', '境外资产管理', 298.00, 27.1710, '7.3', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.00, 0.00, 8707.56, 8707.56, '贵金属', 8096.96, 1.00, 610.60, 8.94),
(24, 'cash', '美元余额', 'us_stock', 1.0000, 1.0000, '雪盈证券', '境外资产管理', 4079.19, 1.0000, '7.3', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.00, 0.00, 4079.19, 4079.19, '现金', 4079.19, 1.00, 0.00, 0.00),
(25, 'cash', '港币余额', 'hk_stock', 1.0000, 1.0000, '雪盈证券', '境外资产管理', 3633.03, 1.0000, '0.9398', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.00, 0.00, 3633.03, 3633.03, '现金', 3633.03, 1.00, 0.00, 0.00),
(26, '217022', '招商产业债A', 'fund', 1.8274, 1.8273, '支付宝', '风险平价资产配置', 79934.48, 1.7912, '1.0', 1.00, 1.00, NULL, '2025-04-22 20:03:19', 0.03, 0.02, 146072.27, 146072.27, '债券', 143178.64, 1.00, 2893.63, 7.99);
