'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

//
const HtmlWebpackPlugin = require('html-webpack-plugin');

const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
        module: {
            rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
        },
        devtool: config.dev.devtool,

        devServer: {
            clientLogLevel: 'warning',
            historyApiFallback: true,
            hot: true,
            compress: true,
            host: HOST || config.dev.host,
            port: PORT || config.dev.port,
            open: config.dev.autoOpenBrowser,
            overlay: config.dev.errorOverlay
                ? { warnings: false, errors: true }
                : false,
            publicPath: config.dev.assetsPublicPath,
            proxy: config.dev.proxyTable,
            quiet: true,
            watchOptions: {
                poll: config.dev.poll
            }
    },
    plugins: [
      new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('dev')
      }),
      new webpack.HotModuleReplacementPlugin(),

      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'index.html',
          inject: true,
          path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory
      }),
      // new webpack.ProvidePlugin({
      //   $: "jquery",
      //   jQuery: "jquery"
      // })
]
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            process.env.PORT = port;
            devWebpackConfig.devServer.port = port;

            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application of timing is running here: http://${devWebpackConfig.devServer.host}:${port}`]
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }));

            resolve(devWebpackConfig);
        }
    });
});
