const config = require('@martinferra/config');
const { exec } = require('child_process');

const chromeDebugPort = 9222;
const remoteDebuggingPort = `--remote-debugging-port=${chromeDebugPort}`;
const userDataDir = `--user-data-dir="C:\\chrome-dev-profile"`;
const url = 'http://localhost:' + config.browserSync.port;

(async () => {
    const chromeLauncher = await import('chrome-launcher');
    const chromePaths = await chromeLauncher.Launcher.getInstallations();
    const chromePath = chromePaths[0]; // Use the first found Chrome installation
    exec(`"${chromePath}" ${remoteDebuggingPort} ${url} ${userDataDir}`, (err) => {
      if (err) {
        console.error(`Error launching Chrome: ${err}`);
        return;
      }
      console.log(`Chrome launched with remote debugging on port ${chromeDebugPort}`);
    });
})();