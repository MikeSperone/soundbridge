require('dotenv').config();
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './src/js/index.js',
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
            { from: 'src/js/AudioContextMonkeyPatch.js', to: 'dist/js/' },
            { from: 'src/index.html', to: 'dist/' },
        ]),
    ],
    output: {
        filename: "bundle.js"
    }
};
