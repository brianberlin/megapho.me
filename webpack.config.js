const webpack = require('webpack');

module.exports = {
  entry: './app/app.js',
  output: { path: 'build', filename: 'app.js' },
  resolve: { modulesDirectories: ['node_modules'] },
  module: {
    loaders: [
      { test: /\.(html|md)/, loader: 'html' },
      { test: /\.(css|sass|scss)/, loaders: ['style', 'css', 'sass'] },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
    ]
  },
  sassLoader: {
    indentedSyntax: true
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: `app.map.js?v=${new Date().getTime()}`,
      moduleFilenameTemplate: '[resource-path]',
      fallbackModuleFilenameTemplate: '[resource-path]?[hash]'
    })
  ]
};