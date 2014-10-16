module.exports = function(config) {
	config.set({
		browsers: ['Chrome','Firefox'],
		frameworks: ['jasmine'],
		files: [
			'../client/code/**/hello*.js',
			'**/*.spec.js'
		]
	});
};