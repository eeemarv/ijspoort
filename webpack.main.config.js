module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  externals: {
    leveldown: 'leveldown',
    pouchdb: 'pouchdb',
    pouchdbFind: 'pouchdb-find',
    pkcs11js: 'pkcs11js',
  }
};
