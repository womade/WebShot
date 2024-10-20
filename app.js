const express = require('express');
const puppeteer = require('puppeteer');
function getCurrentTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // 格式化为YYYY-MM-DD HH:mm:ss
}
const app = express();
const port = 3030;
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
      error: '❌ Failed to process request',
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
