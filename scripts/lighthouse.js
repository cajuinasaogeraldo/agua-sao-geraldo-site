import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headed'] });
  const options = { logLevel: 'info', output: 'html', port: chrome.port };
  const result = await lighthouse(url, options);
  await chrome.kill();
  return result;
}

runLighthouse('http://localhost:4325').then((r) => {
  console.log(r.lhr.categories.performance.score);
});
