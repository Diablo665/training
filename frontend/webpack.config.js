const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: './app-todo-list/js/main.js',
        statistics: './app-todo-list/js/statistics.js'

    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        port: 5500,
        host: 'localhost',
        static: {
            directory: path.join(__dirname, 'app-todo-list'),
            serveIndex: false, 
            watch: true
        },
        historyApiFallback: true, 
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/', // Публичный путь должен совпадать с devServer
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js'
    },

    optimization: {
        minimize: true,
        usedExports: true,
        splitChunks: {
            chunks: 'all'
        }
    },

    performance: {
        maxAssetSize: 700000, 
        maxEntrypointSize: 700000, 
        hints: 'warning'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app-todo-list/index.html',
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: './app-todo-list/statistics.html',
            filename: 'statistics.html',
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