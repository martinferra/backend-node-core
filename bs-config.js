require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const serverPort = process.env.SERVER_PORT || 4040;
const browserSyncPort = process.env.BS_PORT || 3000;

module.exports = {
    proxy: "http://localhost:" + serverPort,
    files: ["dist/mean-core/**/*.*"],
    reloadDelay: 1000,
    port: browserSyncPort,
    browser: require('path').join(__dirname, "launch-chrome-with-debugging.cmd")
};