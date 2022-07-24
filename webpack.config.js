module.exports = {
	entry: "./app/js/app.js",
	output: {
		path: __dirname + "/build/app/js",
		filename: "app.js",
	},
	module: {
		rules: [],
	},
	resolve: {
		fallback: {
			assert: false,
			crypto: false,
			http: false,
			https: false,
			os: false,
			stream: false,
			url: false,
		},
	},
};
