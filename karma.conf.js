module.exports = function(config) {
    config.set({
        frameworks: ['mocha','browserify'],
        preprocessors: {
            'test/**/*.js': [ 'browserify' ]
        },

        reporters: ['nyan'],

        nyanReporter: {
            suppressErrorReport: true,
            suppressErrorHighlighting: true
        },
        browserify: {
            debug: true
        },
        browsers: ['Chrome'],
        //browser: ['PhantomJS'],
        //browsers: ['PhantomJS','Chrome'],
        files: ['./test/**/*.spec.js']
    })
}
