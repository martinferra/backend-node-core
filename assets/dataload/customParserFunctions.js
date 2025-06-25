const customConfig = new Map();

function getConfig(key) {
    return key==='--d' || key==='--default'? null : customConfig[key];
}

module.exports = getConfig