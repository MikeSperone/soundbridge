const dev = true,
	  src = 'src',
	  build = 'build',
	  host = 'localhost',
	  port = 8080;

module.exports = {
	src: src,
    build: build,
    host: host,
	port: port,
	server: {
		build: '../web/' + build
	}
};