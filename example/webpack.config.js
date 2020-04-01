/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
  mode: 'development',

  entry: path.join(__dirname, 'src/main.ts'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    // path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    // publicPath: path.join(__dirname, '__build__'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          configFile: path.join(__dirname, 'tsconfig.demo.json'),
        },
      },
    ],
  },

  resolve: {
    alias: {
      'vue-act-master': path.resolve(__dirname, '..', 'dist'),
    },
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'shared',
          filename: 'shared.js',
          chunks: 'initial',
        },
      },
    },
  },

  devtool: '#cheap-source-map',

  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
      minify: false,
      filename: 'index.html',
      template: path.join(__dirname, 'index.html'),
      inject: true,
    }),
  ],

  devServer: {
    host: '0.0.0.0',
    hot: true,
    useLocalIp: true,
    contentBase: path.join(__dirname),
  },
};
