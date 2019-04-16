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
    resolve: {
        modules: [
            'node_modules', './src/js/synths'
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/js/AudioContextMonkeyPatch.js', to: 'js/' },
            { from: 'src/index.html', to: '' },
            { from: 'test/index.html', to: 'test.html' },
        ]),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        host: '0.0.0.0',
        port: 9000,
        disableHostCheck: process.env.NODE_ENV === 'development'
        // proxy: {
            // '/audio': {
            //     target: 'http://localhost:9000',
            //     pathRewrite: {'^/audio': path.join(__dirname, 'public/audio')},
            //     secure: false
            // }
        // }
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/js')
    }
};
