const path = require('path');
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = function override(config, env) {
  config.externals = {
    "nostr-tools": "NostrTools",
  };
  config.resolve.alias = {
    '@': resolve('src')
}
  return config;
};
