require('dotenv').config();
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        main: './src/js/index.js',
        test: './test/test-index.js'
    },
    node: {
        fs: 'empty',
    },
    plugins: [
        new MiniCssExtractPlugin(),
            // {
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // filename: devMode ? 'public/css/[name].css' : 'public/css/[name].[hash].css',
            // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        // }
        // ),
        new CopyPlugin([
            // { from: 'src/js/AudioContextMonkeyPatch.js', to: 'public/js/' },
            { from: path.resolve(__dirname, 'src/index.html'), to: path.resolve(__dirname, 'public/index.html') },
            // { from: 'test/index.html', to: 'public/test.html' },
        ]),
    ],
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
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require('sass'),
                        },
                    },
                ]
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts"],
        modules: [
            'node_modules',
            './src/js'
        ]
    },
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
