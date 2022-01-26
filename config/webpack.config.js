require('dotenv').config();
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const mode = process.env.NODE_ENV;
const devMode = mode !== 'production';

module.exports = {
    mode,
    entry: {
        soundbridge: './src/views/soundbridge.js',
        test: './src/views/test.js',
        // playgrain: './src/synths/playgrain/index.ts'
    },
    node: {
        // fs: 'empty',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Soundbridge",
            filename: 'index.html',
            chunks: ['soundbridge']
        }),
        new HtmlWebpackPlugin({
            title: "Soundbridge Test Suite",
            filename: 'test.html',
            chunks: ['test']
        }),
        new MiniCssExtractPlugin(),
            // {
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // filename: devMode ? 'public/css/[name].css' : 'public/css/[name].[hash].css',
            // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        // }
        // ),
        // new CopyPlugin([
            // { from: 'src/js/AudioContextMonkeyPatch.js', to: 'public/js/' },
        // ]),
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true
                    }
                }
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: true
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
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
        alias: {
            init: path.resolve(__dirname, '../src/init'),
            context: path.resolve(__dirname, '../src/context'),
            components: path.resolve(__dirname, '../src/components'),
            containers: path.resolve(__dirname, '../src/containers'),
            synths: path.resolve(__dirname, '../src/synths'),
            styles: path.resolve(__dirname, '../src/styles'),
            react: 'preact/compat',
            "react-dom": 'preact/compat',
        },
        extensions: [".js", ".ts"],
        modules: [
            'node_modules',
            './src'
        ]
    },
    // devServer: {
    //     contentBase: path.join(__dirname, '../../public'),
    //     host: '0.0.0.0',
    //     port: 9000,
    //     disableHostCheck: process.env.NODE_ENV === 'development'
    // },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../../public')
    }
};
