/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'release',
  docs_dir: 'doc',
  coverage_dir: 'coverage',
  test_report_dir: 'test',

  protractorURL: 'http://scienskim:8000',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `html` is just our
   * main HTML file, `sass` is our main stylesheet, `jsunit` contains our
   * app's unit tests, and `jspro` contains protractor tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    jspro: 'protractor/e2e/**/*.js',
    
    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    css: ['src/app/app.css','src/**/*.css'],
    sass: ['src/**/*.sass'],
    assets: [ 'src/assets/**/*' ],

    html: [ 'src/template.html' ]
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'lib/angular-mocks/angular-mocks.js'
    ]
  },

  ngdocs_files: {
    scripts:['../lib/jquery/**/jquery.min.js','../lib/angular/angular.js','../lib/angular-animate/angular-animate.js','../lib/angular-i18n/**/*_en.js','../src/app/**/*.js','!../src/app/**/*.spec.js'],
    styles: ['../src/app/app.css','../ngdoc/ngdoc.css'],
    src: {
      SP: ['ngdoc/SP/**/*.ngdoc','src/app/**/*.js','!src/app/**/*.spec.js'],
      ngdoc: ['ngdoc/ngdoc/**/*.ngdoc'],
      MCGuide: ['ngdoc/MCGuide/**/*.ngdoc']
    }
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'lib/jquery/**/jquery.min.js',
      'lib/angular/**/angular.js',
      'lib/angular-route/**/angular-route.js',
      'lib/angular-animate/**/angular-animate.js',
      'lib/respond/**/respond.src.js'
    ],
    assets: [
      'lib/bootstrap/**/bootstrap.css'
    ]
  },

  meta_files: {
    agent_mappings: [
      'metasrc/agent_mappings/src_dest.xml'
    ],
    data_structures: [
      'metasrc/data_structures/**/*.csv','metasrc/data_structures/**/*.xml'
    ],
    event_mappings: [
      'metasrc/event_mappings/src_dest.xml'
    ],
    infocard_type: [
      'metasrc/infocard_types/infocard_type.xml'
    ],
    lifecycle: [
      'metasrc/life_cycles/lifecycle.xml'
    ],
    numbering: [
      'metasrc/numbering_series/numbering.xml'
    ],
    role: [
      'metasrc/roles/role.xml'
    ],
    route: [
      'metasrc/routes/route.xml'
    ],
    template_infocard: [
      'metasrc/templates/templateinfocard.xml'
    ],
    vault: [
      'metasrc/vaults/vault.xml'
    ],
    version: [
      'metasrc/version-X.X.X.txt'
    ]
  }
};
