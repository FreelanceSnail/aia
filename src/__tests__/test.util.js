import fs from 'fs';
import path from 'path';

/**
 * 读取 .dev.vars 文件中的 API_TUSHARE_TOKEN，用于测试
 * @returns {string} API_TUSHARE_TOKEN
 */
function loadTushareToken() {
    const envPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../.dev.vars');
    if (!fs.existsSync(envPath)) {
        throw new Error(`未找到 .dev.vars 文件: ${envPath}`);
    }
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(/^API_TUSHARE_TOKEN="?([^\"]+)"?/m);
    if (!match) {
        throw new Error('未在 .dev.vars 文件中找到 API_TUSHARE_TOKEN');
    }
    return match[1];
}

export { loadTushareToken };
