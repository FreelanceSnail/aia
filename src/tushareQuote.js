// tushareQuote.js
// 用于通过Tushare后端服务获取股票、期权、期货的报价
// 需要后端有对应的RESTful API支持

import axios from 'axios';

// 配置Tushare后端API的baseURL
const BASE_URL = 'https://api.tushare.pro';

/**
 * 通用 tushare 行情查询
 * @param {object} body 查询参数对象，需包含api_name、token、params、fields
 * @returns {Promise<{ts_code: string, price: number, preclose: number, trade_date?: string} | null>} 查询结果字典，查不到返回 null
 * @throws {Error} tushare API异常时抛出
 */
async function queryTushareQuote(body) {
    const res = await axios.post(BASE_URL, body);
    if (res.data && res.data.code === 0) {
        const { fields, items } = res.data.data || {};
        if (!fields || !items || items.length === 0) return null;
        const idx_ts_code = fields.indexOf('ts_code');
        const idx_close = fields.indexOf('close');
        const idx_preclose = fields.indexOf('pre_close');
        const row = items[0];
        const idx_trade_date = fields.indexOf('trade_date');
        return {
            ts_code: row[idx_ts_code],
            price: row[idx_close],
            preclose: row[idx_preclose],
            trade_date: idx_trade_date !== -1 ? row[idx_trade_date] : undefined
        };
    } else {
        throw new Error(res.data.msg || 'Tushare API error');
    }
}

/**
 * 股票查询参数模板
 * @param {string} symbol 股票ts_code
 * @param {string} token tushare token
 * @returns {object} tushare股票查询参数
 */
export const STOCK_QUERY_BODY = (symbol, token) => ({
    api_name: 'daily',
    token,
    params: { ts_code: symbol },
    fields: ''
});

/**
 * 期权查询参数模板
 * @param {string} symbol 期权ts_code
 * @param {string} token tushare token
 * @returns {object} tushare期权查询参数
 */
export const OPTION_QUERY_BODY = (symbol, token) => ({
    api_name: 'opt_daily',
    token,
    params: { ts_code: symbol },
    fields: ''
});

/**
 * 期货查询参数模板
 * @param {string} symbol 期货ts_code
 * @param {string} token tushare token
 * @returns {object} tushare期货查询参数
 */
export const FUTURE_QUERY_BODY = (symbol, token) => ({
    api_name: 'fut_daily',
    token,
    params: { ts_code: symbol },
    fields: ''
});


/**
 * 检测symbol类型
 * @param {string} symbol
 * @returns {'stock'|'option'|'future'}
 */
function detectSymbolType(symbol) {
    // 1. 先判断沪深交易所的股票
    if (/^[036]\d{5}\.(SH|SZ)$/i.test(symbol)) {
        return 'stock';
    }
    // 2. 沪深交易所的期权
    if (/^1\d{7}\.(SH|SZ)$/i.test(symbol)) {
        return 'option';
    }
    // 3. 期货/期权（中金所、大商所、上期所、郑商所、能源中心等）
    // 期权合约一般带有 -C- 或 -P- 或 -C 或 -P
    // 例：IO2509-C-3800.CFX、IO2509-P-3800.CFX、SR3012P4800.CZC、AU.SHF
    if (/-(C|P)-/i.test(symbol) || /-(C|P)\d*/i.test(symbol)) {
        // 期权合约
        return 'option';
    }
    // 期货合约（如 IC2512.CFX, AU.SHF, SR3012.CZC, etc.）
    if (/^[A-Za-z0-9\-]+\.[A-Z]+$/i.test(symbol)) {
        return 'future';
    }
    throw new Error('无法识别symbol类型: ' + symbol);
}

/**
 * 通用报价接口，自动识别symbol类型（股票、期权、期货）
 * @param {string} symbol 证券/合约代码（支持股票、期权、期货）
 * @param {string} token tushare token
 * @returns {Promise<{ts_code: string, price: number, preclose: number, trade_date?: string} | null>} 查询结果字典，查不到返回 null
 * @throws {Error} symbol类型无法识别或tushare API异常时抛出
 */
async function getQuote(symbol, token) {
    const type = detectSymbolType(symbol);
    switch(type) {
        case 'stock':
            return queryTushareQuote(STOCK_QUERY_BODY(symbol, token));
        case 'option':
            return queryTushareQuote(OPTION_QUERY_BODY(symbol, token));
        case 'future':
            return queryTushareQuote(FUTURE_QUERY_BODY(symbol, token));
        default:
            throw new Error('未知symbol类型: ' + symbol);
    }
}

export { getQuote };

