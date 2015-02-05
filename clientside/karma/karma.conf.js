module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      <% scripts.forEach( function ( file ) { %>'<%= file %>',
      <% }); %>
    ],

    exclude: [
      'src/assets/**/*.js'
    ],

    preprocessors: {
      '**/app/**/*.js': 'coverage'
    },

    reporters: ['coverage','junit','progress'],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    loggers: [
     {
      type: 'console'
    },
    {
      type: 'file',
      absolute: false,
      filename: 'test/run.log',
      maxLogSize: 20480,
      backups: 2,
    }],

    junitReporter: {
      outputFile: 'test/unit.xml',
      suite: 'unit',
      xsl: 'karma/junit.xsl'
    },

    autoWatch: false,

    browsers: ['Chrome','Firefox','IE'],

    frameworks: ['jasmine'],

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-junit-reporter',
      'karma-commonjs',
      'karma-coverage'
    ]
  });
};
