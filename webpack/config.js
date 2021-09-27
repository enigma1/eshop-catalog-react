'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");

const config = {
  entry: {
    main: path.resolve('./src/index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './public/development'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new CopyPlugin({
      patterns: [
        {from: './assets', to: './', toType: 'dir'}
      ]
    }),
    new ContextReplacementPlugin(/\/Pages/, './Pages', {
      './request': './request',
      './other-request': './new-request'
    }),
  ],
  resolve: {
    modules: [path.join(__dirname, '..', 'src'), 'node_modules'],
    extensions: ['.es6', '.jsx', '.js'],
    alias: {
      Header: path.resolve(__dirname, './Modules/Header/'),
      Templates: path.resolve(__dirname, 'src/Templates/')
    }
  },
  module: {
    rules: [
      {
        test: /\.(m?js|jsx|es6)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            //presets: ['@babel/preset-env'],
            //plugins: []
          }
        }
      },
      {
        test: /\.(png|jp(e)g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              native: false,
            },
          },
        ],
      }
    ]
  }
};

module.exports = config;
