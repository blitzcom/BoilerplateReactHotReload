const webpack = require('webpack');
const util = require('./utils/util');
const config = require('./config/webpack.config');
const WebpackDevServer = require('webpack-dev-server');

const DEV_PORT = process.env.npm_package_config_dev || 3000;

const conf = config.devConfig(DEV_PORT);
const compiler = webpack(conf);

/**
 * Handle compiler events
 */
compiler.plugin('invalid', function() {
  util.clear();
  console.log('Compiling...');
});

compiler.plugin('done', function(stats) {
  util.clear();
  const hasErrors = stats.hasErrors();
  const hasWarnings = stats.hasWarnings();

  if (hasErrors || hasWarnings) {
    console.log(util.red('Compilation ERROR'));
    console.log();
    console.log(stats.toString({
      chunks: false,
      colors: true
    }));
    return;
  }

  console.log('Build for Development with Hot-Reload\n');
  console.log(util.green('Compilation OK'));
  console.log();
  console.log('Go to http://localhost:%s', DEV_PORT);
});

/**
 * Configure dev server
 * @type {WebpackDevServer}
 */
const devServer = new WebpackDevServer(
  compiler,
  {
    publicPath: conf.output.publicPath,
    contentBase: conf.output.path,
    hot: true,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true
  }
);

/**************
 * Main Entry *
 **************/

util.handleExit();
util.clear();

console.log('Build for Development with Hot-Reload\n');

/**
 * Clean and copy assets to public directory
 */
util.clean().then(function() {
  return util.copyAssets();
}).then(function() {
  devServer.listen(
    DEV_PORT,
    function(error) {
      if (error) {
        console.log(error);
        return;
      }
      console.log(util.green('Server OK'));
      console.log();
      console.log('Compiling...');
    }
  );
}).catch(function() {});
