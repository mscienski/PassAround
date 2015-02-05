exports.config = {
  allScriptsTimeout: 11000,

  seleniumArgs: ['-Dwebdriver.ie.driver=protractor/IEDriverServer.exe'],

  specs: [
    <% specs.forEach( function ( file ) { %>'../<%= file %>',
    <% }); %>
  ],

  multiCapabilities: [{
    'browserName': 'chrome'
  }, {
    'browserName': 'firefox'
  }, {
    'browserName': 'internet explorer'
  }],

  baseUrl: '<%= baseURL %>',

  framework: 'jasmine',

  rootElement: '#ng-app',

  onPrepare: function() {
    require('jasmine-reporters');

    jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(
        '<%= reportDir %>', true, true, 'TEST-','protractor/junit.xsl'));
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    includeStrackTrace: true,
    showColors: true,
    isVerbose: true
  }
};