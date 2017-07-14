module.exports = {
	entry: "./src/js/soundbridge.js",
	output: {
		path: __dirname + "/build/js",
		filename: "bundle.js"
	},
	module: {
		loaders: [{
			test: /\.js?$/,
			exclude: /(node_modules)/,
			loader: 'babel-loader'
		}]
	}
};
