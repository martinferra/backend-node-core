const config = require('@martinferra/config');

module.exports = {
    proxy: "http://localhost:" + config.port, // Replace with your server URL
    files: ["dist/mean-core/**/*.*"], // Files to watch for changes
    reloadDelay: 1000, // Delay before reloading
    port: config.browserSync.port, // Port for browser-sync server
    browser: "launch-chrome-with-debugging.cmd" // Use batch file to launch Chrome with URL
};