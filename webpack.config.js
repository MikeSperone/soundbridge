require('dotenv').config();
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        main: './src/js/index.js',
        test: './test/test-index.js'
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
    plugins: [
        new CopyPlugin([
            { from: 'src/js/AudioContextMonkeyPatch.js', to: 'js/' },
            { from: 'src/index.html', to: '' },
            { from: 'test/index.html', to: 'test.html' },
        ]),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        host: '0.0.0.0',
        port: 9000
    },
    output: {
        filename: '[name].js'
    }
};
