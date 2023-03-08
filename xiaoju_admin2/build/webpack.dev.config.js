const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, 'utf-8', function(err, written, buffer) {});
});

fs.open('./build/host.js', 'w', function(err, fd) {
    let IHOST = 'local';  // 本地地址
    const buf = 'export default "'+IHOST+'";';
    fs.write(fd, buf, 0, 'utf-8', function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/static',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),

        new CopyWebpackPlugin([
            {
                from: 'src/views/components/main/theme-switch/theme'
            }
        ], {
            ignore: [
                'text-editor.vue'
            ]
        }),
        new HtmlWebpackPlugin({
            title: '小驹游乐管理平台 v' + package.version,
            favicon: './favicon.ico',
            filename: '../index.html',
            template: '!!ejs-loader!./src/template/index.ejs',
            inject: false
        })
        // new BundleAnalyzerPlugin()
    ]
});