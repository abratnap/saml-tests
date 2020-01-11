'use strict';

const eyeglass = require('eyeglass');
const autoprefixer = require('autoprefixer');
const config = require('config');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: 'public/css/[name].css',
  disable: process.env.NODE_ENV === 'development',
});
const extractCSS = new ExtractTextPlugin({
  filename: 'public/css/[name].css',
  disable: process.env.NODE_ENV === 'development',
});

const browserSync = new BrowserSyncPlugin(
  {
    host: 'localhost',
    port: 3000,
    proxy: `http://localhost:${config.env.port}`,
  },
  {
    name: 'server',
  },
);


module.exports = {
  entry: {
    'style': './src/sass/style.scss',
    'fonts': './src/sass/fonts.css',
  },
  output: {
    filename: 'public/js/[name].js',
    publicPath: 'public/',
  },
  devtool: 'source-map',
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: true,
    assets: true,
    chunks: true,
    modules: true,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false,
    maxModules: 0,
  },
  module: {
    rules: [
      {
        test: /\.woff2$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => {
                  return [
                    autoprefixer,
                  ];
                },
              },
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: false,
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => {
                  return [
                    autoprefixer,
                  ];
                },
              },
            },
            {
              loader: 'sass-loader',
              options: eyeglass({
                sourceMap: true,
              }),
            },
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  plugins: [
    extractCSS,
    extractSass,
    browserSync,
  ],
};
