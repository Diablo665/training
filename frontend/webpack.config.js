const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: [
            'webpack-hot-middleware/client?reload=true',
            './app-todo-list/js/main.js'
        ],
        statistics: [
            'webpack-hot-middleware/client?reload=true',
            './app-todo-list/js/statistics.js'
        ]
    },
    mode: 'production',
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        port: 5500,
        contentBase: './dist',
        historyApiFallback: true,
        watchContentBase: true,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app-todo-list/index.html',
            filename: 'index.html',
            chunks: 'index'
        }),
        new HtmlWebpackPlugin({
            template: './app-todo-list/statistics.html',
            filename: 'statistics.html',
            chunks: 'statistics'
        }),
        new MiniCssExtractPlugin({

            filename: 'css/[name].css'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]'
                }
            },
            {
                test: /\.(svg)$/i,
                type: 'asset/inline'
            }
        ]
    }
};