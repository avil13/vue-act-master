// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('path');

module.exports = function nuxtVueActMaster(moduleOptions) {
  // Register plugin
  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'vue-act-master.js',
    options: moduleOptions,
    ssr: true,
  });
};

module.exports.meta = require('../package.json');
