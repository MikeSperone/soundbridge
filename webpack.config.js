require('dotenv').config();
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        main: './src/js/index.js',
        test: './test/test-index.js'
    },
    node: {
        fs: 'empty',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                }
        }],
    },
    resolve: {
        modules: [
            'node_modules', './src/js'
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/js/AudioContextMonkeyPatch.js', to: 'public/js/' },
            { from: 'src/index.html', to: 'public' },
            { from: 'test/index.html', to: 'public/test.html' },
        ]),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        host: '0.0.0.0',
        port: 9000,
        disableHostCheck: process.env.NODE_ENV === 'development'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public')
    }
};
