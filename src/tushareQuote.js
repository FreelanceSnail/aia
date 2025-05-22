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
        const rlt = {
            ts_code: row[idx_ts_code],
            price: row[idx_close],
            preclose: row[idx_preclose],
            trade_date: idx_trade_date !== -1 ? row[idx_trade_date] : undefined
        }
        console.debug(`Got symbol ${rlt.ts_code}: price=${rlt.price}, preclose=${rlt.preclose}, trade_date=${rlt.trade_date}`);
        return rlt;
    } else {
        console.error(`Tushare API error: ${res.data.msg}`);
        return null;
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
    params: { ts_code: symbol, limit: 1 },
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
    params: { ts_code: symbol, limit: 1 },
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
    params: { ts_code: symbol, limit: 1 },
    fields: ''
});

/**
 * 基金查询参数模板
 * @param {string} symbol 场内基金ts_code
 * @param {string} token tushare token
 * @returns {object} tushare基金查询参数
 */
export const ETFLOF_QUERY_BODY = (symbol, token) => ({
    api_name: 'fund_daily',
    token,
    params: { ts_code: symbol, limit: 1 },
    fields: ''
});

/**
 * 指数查询参数模板
 * @param {string} symbol 指数ts_code
 * @param {string} token tushare token
 * @returns {object} tushare指数查询参数
 */
export const INDEX_QUERY_BODY = (symbol, token) => ({
    api_name: 'index_daily',
    token,
    params: { ts_code: symbol, limit: 1 },
    fields: ''
});

/**
 * 场外基金查询参数模板
 * @param {string} symbol 场外基金ts_code
 * @param {string} token tushare token
 * @returns {object} tushare场外基金查询参数
 */
export const OFUND_QUERY_BODY = (symbol, token) => ({
    api_name: 'fund_nav',
    token,
    params: { ts_code: symbol, limit: 2 },
    fields: ''
});

/**
 * 美股行情查询，通过雅虎财经WEB API
 * @param {string} symbol 美股代码
 * @returns {Promise<{ts_code: string, price: number, preclose: number, trade_date?: string} | null>}
 */
async function queryYahooQuote(symbol) {
    try {
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        const res = await axios.get(url);
        const result = res.data.quoteResponse?.result;
        if (!result || result.length === 0) return null;
        const quote = result[0];
        const price = quote.regularMarketPrice;
        const preclose = quote.regularMarketPreviousClose;
        const time = quote.regularMarketTime;
        const trade_date = time ? new Date(time * 1000).toISOString().slice(0,10).replace(/-/g,'') : undefined;
        console.debug(`Got symbol ${symbol}: price=${price}, preclose=${preclose}, trade_date=${trade_date}`);
        return { ts_code: symbol, price, preclose, trade_date };
    } catch (error) {
        console.error(`queryYahooQuote error for symbol ${symbol}:`, error);
        return null;
    }
}

/**
 * 场外基金净值查询
 * @param {object} body 查询参数对象
 * @returns {Promise<{ts_code: string, price: number, preclose: number, trade_date?: string} | null>}
 */
async function queryFundNav(body) {
    const res = await axios.post(BASE_URL, body);
    if (res.data && res.data.code === 0) {
        const { fields, items } = res.data.data || {};
        if (!fields || !items || items.length === 0) return null;
        const idx_ts_code = fields.indexOf('ts_code');
        const idx_nav = fields.indexOf('unit_nav');
        const idx_nav_date = fields.indexOf('nav_date');
        const latest = items[0];
        const prev = items[1] || latest;
        const rlt = {
            ts_code: latest[idx_ts_code],
            price: latest[idx_nav],
            preclose: prev[idx_nav],
            trade_date: idx_nav_date !== -1 ? latest[idx_nav_date] : undefined
        };
        console.debug(`Got symbol ${rlt.ts_code}: price=${rlt.price}, preclose=${rlt.preclose}, trade_date=${rlt.trade_date}`);
        return rlt;
    } else {
        console.error(`Tushare API error: ${res.data.msg}`);
        return null;
    }
}

/**
 * 检测symbol类型
 * @param {string} symbol
 * @returns {'indice'|'etflof'|'stock'|'option'|'ofund'|'future'|'us_stock'|'unkown'}
 */
function detectSymbolType(symbol) {
    // 1. 判断指数（000开头六位数字.SH 或 399开头六位数字.SZ）
    if (/^000\d{3}\.SH$/i.test(symbol) || /^399\d{3}\.SZ$/i.test(symbol)) {
        return 'indice';
    }
    // 2. 判断沪深交易所的场内基金（5开头六位数字.SH 或 1开头六位数字.SZ）
    if (/^5\d{5}\.SH$/i.test(symbol) || /^1\d{5}\.SZ$/i.test(symbol)) {
        return 'etflof';
    }
    // 3. 判断沪深交易所的股票（0、3、6开头六位数字+.SH或.SZ结尾）
    if (/^[036]\d{5}\.(SH|SZ)$/i.test(symbol)) {
        return 'stock';
    }
    // 4. 判断沪深交易所的期权（1开头八位数字+.SH或.SZ结尾）
    if (/^1\d{7}\.(SH|SZ)$/i.test(symbol)) {
        return 'option';
    }
    // 5. 判断场外基金（.OF结尾）
    if (/\.OF$/i.test(symbol)) {
        return 'ofund';
    }
    // 6. 判断期权合约（带有-C-/-P-或-C/-P等）
    // 例：IO2509-C-3800.CFX、IO2509-P-3800.CFX、SR3012P4800.CZC、AU.SHF
    if (/-(C|P)-/i.test(symbol) || /-(C|P)\d*/i.test(symbol)) {
        return 'option';
    }
    // 7. 判断期货合约（如 IC2512.CFX, AU.SHF, SR3012.CZC, etc.）
    if (/^[A-Za-z0-9\-]+\.[A-Z]+$/i.test(symbol)) {
        return 'future';
    }
    // 8. 判断美股（纯字母且没有“.”）
    if (/^[A-Za-z]+$/.test(symbol)) {
        return 'us_stock';
    }
    return 'unkown';
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
        case 'etflof':
            return queryTushareQuote(ETFLOF_QUERY_BODY(symbol, token));
        case 'indice':
            return queryTushareQuote(INDEX_QUERY_BODY(symbol, token));
        case 'ofund':
            return queryFundNav(OFUND_QUERY_BODY(symbol, token));
        case 'us_stock':
            return queryYahooQuote(symbol);
        default:
            return null;
    }
}

export { getQuote };
