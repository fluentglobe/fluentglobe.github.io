module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		frameworks: ['jasmine'],
		files: [
			'client/code/**/hello*.js',
			'test/**/*.spec.js'
		]
	});
};