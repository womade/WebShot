const express = require('express');
const puppeteer = require('puppeteer');

function getCurrentTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // 格式化为YYYY-MM-DD HH:mm:ss
}

const app = express();
const port = 3330;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeUrl(url) {
  const urlPattern = /^(https?:\/\/[^\s$]+)/i;
  return urlPattern.test(url) ? url : 'https://error-url.ssss.fun'; // 使用默认 URL
}

app.get('/screenshot', async (req, res) => {
  const { url = 'https://i.ssss.fun', w: width = 1920, h: height = 1080, t: delaySec = 1 } = req.query;
  const sanitizedUrl = sanitizeUrl(url);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    // 从请求头中获取所有自定义头信息
    const customHeaders = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection' && key.toLowerCase() !== 'accept-encoding') {
        // 排除一些不需要的或可能干扰的头部信息
        customHeaders[key] = value;
      }
    }
    // 设置默认的 user-agent，如果请求中有提供则覆盖
    customHeaders['user-agent'] = req.headers['user-agent'] || 'Linux; Android 16; YZ1998 Build/CNZ1.980309.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.188 Mobile Safari/537.36 XWEB/1260117 MMWEBSDK/20240802 MMWEBID/3898 MicroMessenger/8.0.53.2740(0x28003533) WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64';
    await page.goto(sanitizedUrl);
    const delayMs = parseInt(delaySec, 10) * 1000;
    await delay(delayMs);
    await page.setViewport({ width: parseInt(width, 10), height: parseInt(height, 10) });

    // 执行截图
    const screenshotBuffer = await page.screenshot();

    // 发送截图作为响应
    res.set('Content-Type', 'image/png'); // 设置响应头以指示内容类型
    res.send(screenshotBuffer); // 发送截图二进制数据
  } catch (error) {
    const timestampedError = `[${getCurrentTimestamp()}] Error processing request: ${error.message}`;
    console.error(timestampedError);
    res.status(500).json({
      error: '❎ Failed to process request',
      details: error.message,
      time: getCurrentTimestamp()
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
