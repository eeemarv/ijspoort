module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  devtool: 'source-map',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  externals: {
    leveldown: 'leveldown',
    pouchdb: 'pouchdb',
    pkcs11js: 'pkcs11js',
    pcsclite: 'pcsclite'
  }
};
