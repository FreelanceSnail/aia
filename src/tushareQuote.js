// tushareQuote.js
// 用于通过Tushare后端服务获取股票、期权、期货的报价
// 需要后端有对应的RESTful API支持

import axios from 'axios';

// 配置Tushare后端API的baseURL
const BASE_URL = 'https://api.tushare.pro';
const TUSHARE_TOKEN = process.env.TUSHARE_TOKEN || '';

if (!TUSHARE_TOKEN) {
    throw new Error('请设置TUSHARE_TOKEN环境变量为你的tushare token');
}

/**
 * 获取股票报价
 * @param {string} symbol 股票代码
 * @returns {Promise<{ts_code: string, price: number, preclose: number} | null>} 行情数据字典，查不到返回 null
 */
async function getStockQuote(symbol) {
    const body = {
        api_name: 'daily',
        token: TUSHARE_TOKEN,
        params: { ts_code: symbol },
        fields: ''
    };
    const res = await axios.post(BASE_URL, body);
    if (res.data && res.data.code === 0) {
        const { fields, items } = res.data.data || {};
        if (!fields || !items || items.length === 0) return null;
        const idx_ts_code = fields.indexOf('ts_code');
        const idx_close = fields.indexOf('close');
        const idx_preclose = fields.indexOf('pre_close');
        const row = items[0];
        return {
            ts_code: row[idx_ts_code],
            price: row[idx_close],
            preclose: row[idx_preclose]
        };
    } else {
        throw new Error(res.data.msg || 'Tushare API error');
    }
}

/**
 * 获取期权报价
 * @param {string} symbol 期权代码
 * @returns {Promise<{ts_code: string, price: number, preclose: number} | null>} 行情数据字典，查不到返回 null
 */
async function getOptionQuote(symbol) {
    const body = {
        api_name: 'opt_daily',
        token: TUSHARE_TOKEN,
        params: { ts_code: symbol },
        fields: ''
    };
    const res = await axios.post(BASE_URL, body);
    if (res.data && res.data.code === 0) {
        const { fields, items } = res.data.data || {};
        if (!fields || !items || items.length === 0) return null;
        const idx_ts_code = fields.indexOf('ts_code');
        const idx_close = fields.indexOf('close');
        const idx_preclose = fields.indexOf('pre_close');
        const row = items[0];
        return {
            ts_code: row[idx_ts_code],
            price: row[idx_close],
            preclose: row[idx_preclose]
        };
    } else {
        throw new Error(res.data.msg || 'Tushare API error');
    }
}

/**
 * 获取期货报价
 * @param {string} symbol 期货代码
 * @returns {Promise<{ts_code: string, price: number, preclose: number} | null>} 行情数据字典，查不到返回 null
 */
async function getFutureQuote(symbol) {
    const body = {
        api_name: 'fut_daily',
        token: TUSHARE_TOKEN,
        params: { ts_code: symbol },
        fields: ''
    };
    const res = await axios.post(BASE_URL, body);
    if (res.data && res.data.code === 0) {
        const { fields, items } = res.data.data || {};
        if (!fields || !items || items.length === 0) return null;
        const idx_ts_code = fields.indexOf('ts_code');
        const idx_close = fields.indexOf('close');
        const idx_preclose = fields.indexOf('pre_close');
        const row = items[0];
        return {
            ts_code: row[idx_ts_code],
            price: row[idx_close],
            preclose: row[idx_preclose]
        };
    } else {
        throw new Error(res.data.msg || 'Tushare API error');
    }
}

/**
 * 检测symbol类型
 * @param {string} symbol
 * @returns {'stock'|'option'|'future'}
 */
function detectSymbolType(symbol) {
    if (/^1\d{7}\.(SH|SZ)$/i.test(symbol)) {
        return 'option';
    }
    if (/^[036]\d{5}\.(SH|SZ)$/i.test(symbol)) {
        return 'stock';
    }
    if (/^[A-Za-z]+\d+\.[A-Z]+$/i.test(symbol)) {
        return 'future';
    }
    throw new Error('无法识别symbol类型: ' + symbol);
}

/**
 * 通用报价接口，自动识别symbol类型
 * @param {string} symbol 代码
 * @returns {Promise<{ts_code: string, price: number, preclose: number} | null>} 行情数据字典，查不到返回 null
 */
async function getQuote(symbol) {
    const type = detectSymbolType(symbol);
    switch(type) {
        case 'stock':
            return getStockQuote(symbol);
        case 'option':
            return getOptionQuote(symbol);
        case 'future':
            return getFutureQuote(symbol);
        default:
            throw new Error('未知symbol类型: ' + symbol);
    }
}

export { getQuote };

