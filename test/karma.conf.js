module.exports = function(config) {
	config.set({
		browsers: ['Chrome','Firefox'],
		frameworks: ['jasmine'],
		files: [
			'../lib/**/hello*.js',
			'**/*.spec.js'
		]
	});
};