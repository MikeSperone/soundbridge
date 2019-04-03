module.exports = {
    mode: process.env.NODE_ENV,
    entry: './test/index.js',
    output: {
        filename: 'test-bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader?presets[]=es2015'
        }]
    }
};
