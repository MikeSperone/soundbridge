require('dotenv').config();
const CopyPlugin = require('copy-webpack-plugin');

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
    output: {
        filename: '[name].js'
    }
};
