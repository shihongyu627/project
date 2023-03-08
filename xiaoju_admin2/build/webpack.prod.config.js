const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const os = require('os');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, 'utf-8', function(err, written, buffer) {});
});

fs.open('./build/host.js', 'w', function(err, fd) {
    let IHOST = process.env.ihost || 'dev';  // dev / www
    console.log('IHOST ', IHOST)
    const buf = 'export default "'+IHOST+'";';
    fs.write(fd, buf, 0, 'utf-8', function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    output: {
        publicPath: '/app/admin/static/',  // 修改 https://iv...admin 这部分为你的服务器域名 
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js'
    },
    plugins: [
        new cleanWebpackPlugin(['*'], {
            root: path.resolve(__dirname, '../dist')
        }),
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // name: 'vendors',
            // filename: 'vendors.[hash].js'
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        // new UglifyJsParallelPlugin({
        //     workers: os.cpus().length,
        //     mangle: true,
        //     compressor: {
        //       warnings: false,
        //       drop_console: true,
        //       drop_debugger: true
        //      }
        // }),
        new CopyWebpackPlugin([
            {
                from: 'favicon.ico'
            },
            {
                from: path.resolve(__dirname, '../static'),
                to: path.resolve(__dirname, '../dist/static')
            },
            {
                from: 'src/styles/fonts',
                to: 'fonts'
            },
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
    ]
});
