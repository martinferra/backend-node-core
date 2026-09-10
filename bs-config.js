require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const serverPort = process.env.SERVER_PORT || 4040;
const browserSyncPort = process.env.BS_PORT || 3000;

module.exports = {
    proxy: {
        target: "http://localhost:" + serverPort,
        ws: true
    },
    files: ["../dist/**/*.*"],
    reloadDelay: 1000,
    port: browserSyncPort,
    notify: false,
    browser: require('path').join(__dirname, "launch-chrome-with-debugging.cmd")
};