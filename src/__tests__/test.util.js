import fs from 'fs';
import path from 'path';

/**
 * 读取 .dev.vars 文件中的 API_TUSHARE_TOKEN，用于测试
 * @returns {string} API_TUSHARE_TOKEN
 */
function loadTushareToken() {
    // 修复 Windows 路径问题
    let pathname = new URL(import.meta.url).pathname;
    // 在 Windows 上，pathname 可能以 /D:/ 开头，需要去掉前导斜杠
    if (process.platform === 'win32' && pathname.startsWith('/')) {
        pathname = pathname.substring(1);
    }
    const envPath = path.resolve(path.dirname(pathname), '../../.dev.vars');
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
