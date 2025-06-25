const serverProcs = require('./server-processes');
const memoryUsage = require('../../common/commonFunctions').logMemoryUsage;

function init(server) {
    setInterval(() => {
        memoryUsage('Memory usage');
    }, 1000);
}

serverProcs.setProcess('memory-usage', init);
