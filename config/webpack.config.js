module.exports = {
    entry: './src/js/index.js',
	module: {
		rules: [{
			test: /\.js?$/,
			exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }
		}],
	},
	output: {
		filename: "bundle.js"
	}
};
