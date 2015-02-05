'use strict';

module.exports = function ( grunt ) {
  
  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-stripcomments');
  grunt.loadNpmTasks('meta');

  /**
   * These tasks require git to work correctly. They are being retained in hopes of activation
   * when git is used at MasterControl.
   */
  //grunt.loadNpmTasks('grunt-conventional-changelog');
  //grunt.loadNpmTasks('grunt-bump');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );
  var metaConfig = require( './meta.config.js' );

  /**
   * This is the configuration object Grunt uses to give each plugin its 
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    tpls: {
      /**
       * The banner is the comment that is placed at the top of our compiled 
       * source files. It is first processed as a Grunt template, where the `<%=`
       * pairs are evaluated based on this very configuration object.
       */
      banner: 
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.description %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n',
      buildCSSTemplate: 
        '<!-- compiled library CSS -->\n' +
        '<% if (libStyles != undefined) { libStyles.forEach( function ( file ) { %>\n' +
        '<link rel="stylesheet" type="text/css" href="<%= file.replace(dirRE,"") %>" /><% }); } %>\n' +
        '\n\n' +
        '<!-- compiled app CSS -->\n' +
        '<% if (styles != undefined) { styles.forEach( function ( file ) { %>\n' +
        '<link rel="stylesheet" type="text/css" href="<%= file.replace(dirRE,"") %>" /><% }); } %>\n',
      compileCSSTemplate:
        '<!-- compiled library CSS -->\n' +
        '<% if (libStyles != undefined) { libStyles.forEach( function ( file ) { %>\n' +
        '<style type="text/css">\n' +
        '<%= grunt.file.read(file) %>\n' +
        '</style><% }); } %>\n' +
        '\n\n' +
        '<!-- compiled app CSS -->\n' +
        '<% if (styles != undefined) { styles.forEach( function ( file ) { %>\n' +
        '<style type="text/css">\n' +
        '<%= grunt.file.read(file) %>\n' +
        '</style><% }); } %>\n',
      buildJSTemplate: 
        '<!-- compiled library JavaScript -->\n' + 
        '<script type="text/javascript">\n' +
        '   if (!!window.jQuery) {\n' +
        '       jQuery.holdReady(true);\n' +
        '       var oldjq = jQuery.noConflict(true);\n' +
        '   }\n' +
        '</script>\n' + 
        '<% if (libScripts != undefined) { libScripts.forEach( function ( file ) { %>\n' +
        '<script type="text/javascript" src="<%= file.replace(dirRE,"") %>"></script><% }); } %>\n' +
        '<script type="text/javascript">\n' +
        'var jq=jQuery.noConflict();\n' +
        '</script>\n' + 
        '<% if (scripts != undefined) { scripts.forEach( function ( file ) { %>\n' +
        '<script type="text/javascript" src="<%= file.replace(dirRE,"") %>"></script><% }); } %>\n' +
        '<script type="text/javascript">\n' +
        '   jq = jQuery.noConflict(true);\n' +
        '   if (!!oldjq) {\n' +
        '       window.$ = window.jQuery = oldjq;\n' +
        '       jq(function() {\n' +
        '           jQuery.holdReady(false);\n' +
        '       });\n' +
        '   }\n' +
        '</script>\n',
      compileJSTemplate:
        '<!-- compiled library JavaScript -->\n' + 
        '<script type="text/javascript">\n' +
        '   if (!!window.jQuery) {\n' +
        '       jQuery.holdReady(true);\n' +
        '       var oldjq = jQuery.noConflict(true);\n' +
        '   }\n' +
        '</script>\n' + 
        '<% if (libScripts != undefined) { libScripts.forEach( function ( file ) { %>\n' +
        '<script type="text/javascript">\n' +
        '<%= grunt.file.read(file) %>\n' +
        '</script><% }); } %>\n' +
        '<script type="text/javascript">\n' +
        'var jq=jQuery.noConflict();\n' +
        '</script>\n' + 
        '<% if (scripts != undefined) { scripts.forEach( function ( file ) { %>\n' +
        '<script type="text/javascript">\n' +
        '<%= grunt.file.read(file) %>\n' +
        '</script><% }); } %>\n' +
        '<script type="text/javascript">\n' +
        '   jq = jQuery.noConflict(true);\n' +
        '   if (!!oldjq) {\n' +
        '       window.$ = window.jQuery = oldjq;\n' +
        '       jq(function() {\n' +
        '           jQuery.holdReady(false);\n' +
        '       });\n' +
        '   }\n' +
        '</script>\n'
    },

    vendorFileCounter: 0,
    appFileCounter: 0,

    /**
     * These tasks require git to work correctly. They are being retained in hopes of activation
     * when git is used at MasterControl.
     */
    /**
     * Creates a changelog on a new version.
     */
    /*
    changelog: {
      options: {
        repository: '<%= pkg.repository.url %>',
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },
    */
    /**
     * Increments the version number, etc.
     */
    /*
    bump: {
      options: {
        files: [
          "package.json", 
          "bower.json"
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          "package.json", 
          "client/bower.json"
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },    
    */

    connect: {
      delta: {
        options: {
          livereload: true
        }
      },
      keepalive: {
        options: {
          keepalive: true
        }
      },
      singleRun: {
        options: {
          keepalive: false,
          livereload: false
        }
      },
      options: {
        port: 8000,
        protocol: 'http',
        hostname: '*'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      all: [ 
        '<%= build_dir %>', 
        '<%= compile_dir %>',
        '<%= docs_dir %>',
        '<%= coverage_dir %>',
        '<%= test_report_dir %>'
      ],
      release: [
        '<%= compile_dir %>/assets'
      ],
      compile: [
        '<%= compile_dir %>'
      ],
      lint: [
        '<%= test_report_dir %>/*jshint*.xml'
      ],
      test: [
        '<%= build_dir %>/*.conf.js',
        '<%= coverage_dir %>',
        '<%= test_report_dir %>/*.log',
        '<%= test_report_dir %>/*.xml',
        '!<%= test_report_dir %>/*jshint*.xml'
      ],
      doc: [
        '<%= docs_dir %>'
      ]
    },

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_app_assets: {
        src: [ '<%= app_files.assets %>', '<%= app_files.css %>' ],
        dest: '<%= build_dir %>/assets/',
        cwd: '.',
        expand: true,
        flatten: true,
        filter: 'isFile'
      },
      build_app_js: {
        src: [ '<%= app_files.js %>' ],
        dest: '<%= build_dir %>/src/',
        cwd: '.',
        expand: true,
        flatten: true,
        filter: 'isFile',
        options: {
          noProcess: [
            'app.js'
          ]
        },
        rename: function(dest, src) {
          grunt.config.set('appFileCounter',grunt.config.get('appFileCounter') + 1);
          return dest + grunt.config('appFileCounter')+src;
        }
      },
      build_vendor_assets: {
        src: [ '<%= vendor_files.assets %>' ],
        dest: '<%= build_dir %>/lib/',
        cwd: '.',
        expand: true,
        flatten: true,
        filter: 'isFile'
      }, 
      build_vendor_js: {
        src: [ '<%= vendor_files.js %>' ],
        dest: '<%= build_dir %>/lib/',
        cwd: '.',
        expand: true,
        flatten:true,
        filter: 'isFile',
        rename: function(dest, src) {
          grunt.config.set('vendorFileCounter',grunt.config.get('vendorFileCounter') + 1);
          return dest + grunt.config('vendorFileCounter')+src;
        }
      },
      compile_assets: {
        src: [ '**', '!**/*.css' ],
        dest: '<%= compile_dir %>/assets',
        cwd: '<%= build_dir %>/assets',
        expand: true,
        filter: 'isFile'
      },
      options: {
        // exclude binary format from the processContent function
        noProcess: [
          '**/*.{png,gif,jpg,ico,psd,ttf,otf,woff,svg}'
        ]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */ 

      compile_app_css: {
        options: {
          banner: '<%= tpls.banner %>'
        },
        src: ['<%= copy.build_app_assets.dest %>**/*.css'],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>.css'
      },

      compile_app_js: {
        options: {
          banner: '<%= tpls.banner %>'
        },
        src: ['<%= copy.build_app_js.dest %>**/*.js'],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>.js'
      },

      compile_vendor_css: {
        src: ['<%= copy.build_vendor_assets.dest %>**/*.css'],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>.lib.css'
      },

      compile_vendor_js: {
        src: ['<%= copy.build_vendor_js.dest %>**/*.js'],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>.lib.js'
      }
    },

    /**
     * `grunt coffee` compiles the CoffeeScript sources. To work well with the
     * rest of the build, we have a separate compilation task for sources and
     * specs so they can go to different places. For example, we need the
     * sources to live with the rest of the copied JavaScript so we can include
     * it in the final build, but we don't want to include our specs there.
     */
    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: [ '<%= app_files.coffee %>' ],
        dest: '<%= build_dir %>',
        ext: '.js'
      }
    },

    comments: {
      compile: {
        src: ['<%=concat.compile_app_js.dest%>']
      }
    },

    /**
     * `ng-annotate` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngAnnotate: {
      compile: {
        files: [
          {
            src: [ '<%= concat.compile_app_js.dest %>' ],
            dest: '<%= concat.compile_app_js.dest %>'
          }
        ]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= tpls.banner %>'
        },
        files: [
          {
            src: ['<%= concat.compile_vendor_js.dest %>'],
            dest: '<%= concat.compile_vendor_js.dest %>'
          }
        ]
      }
    },

    /**
     * `grunt-sass` handles our Sass compilation and uglification automatically.
     * Only our `main.sass` file is included in compilation; all other files
     * must be imported from this file.
     */
    sass: {
      build: {
        src: ['<%= app_files.sass %>'],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>.sass.css',
        filter: function(file) {
          return file.indexOf('main.sass') !== -1;
        }
      }
    },

    cssmin: {
      compile: {
        options: {
          banner: '<%= tpls.banner %>',
          keepSpecialComments: 0,
          report: 'min'
        },
        src: ['<%= concat.compile_vendor_css.dest %>'],
        dest: '<%= concat.compile_vendor_css.dest %>'
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      app: {
        files: {
          src: '<%= app_files.js %>'
        },
        options: {
          jquery: true,
          globals: {
            "angular": false,
            "mcDatasetPopulation": true
          }
        }
      },
      test: {
        files: {
          src: '<%= app_files.jsunit %>'
        },
        options: {
          jquery: true,
          globals: {
            "angular": false,
            "_": false,
            "_V_": false,
            "afterEach": false,
            "beforeEach": false,
            "confirm": false,
            "context": false,
            "describe": false,
            "expect": false,
            "inject": false,
            "it": false,
            "jasmine": false,
            "JSHINT": false,
            "module": false,
            "mostRecentAjaxRequest": false,
            "qq": false,
            "runs": false,
            "spyOn": false,
            "spyOnEvent": false,
            "waitsFor": false,
            "xdescribe": false
          }
        }
      },
      gruntfile: {
        files: {
          src: ['Gruntfile.js','*.config.js']
        },
        options: {
          browser: false,
          node: true,
          unused: false,
          globals: {
            "module": false,
            "require": false
          }
        }
      },
      options: {
        globalstrict: true,
        force: true,
        reporter: 'jslint',
        reporterOutput: '<%= test_report_dir %>/<%= grunt.task.current.name %>_<%= grunt.task.current.target %>.xml',
        curly: true,
        eqeqeq: true,
        es3: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        nonbsp: true,
        sub: true,
        trailing: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        multistr: true,
        browser: true
      }
    },

    /**
     * `coffeelint` does the same as `jshint`, but for CoffeeScript.
     * CoffeeScript is not the default in ngBoilerplate, so we're just using
     * the defaults here.
     */
    coffeelint: {
      src: {
        files: {
          src: [ '<%= app_files.coffee %>' ]
        }
      },
      test: {
        files: {
          src: [ '<%= app_files.coffeeunit %>' ]
        }
      }
    },

    ngdocs: {
      options: {
        dest: '<%= docs_dir %>',
        scripts: '<%= ngdocs_files.scripts %>',
        startPage: '/SP',
        title: 'Base Template Documentation',
        styles: '<%= ngdocs_files.styles %>',
        html5Mode: false
      },
      SP: {
        src: '<%= ngdocs_files.src.SP %>',
        title: 'Base Template API',
        api: true
      },
      ngdoc: {
        src: '<%= ngdocs_files.src.ngdoc %>',
        title: 'ngdoc Comments'
      },
      MCGuide: {
        src: '<%= ngdocs_files.src.MCGuide %>',
        title: 'MasterControl Programming Guide'
      }
    },

    mkdir: {
      all: {
        options: {
          create: ['<%= test_report_dir %>']
        }
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma.conf.js'
      },
      continuous: {
        background: true
      },
      unit: {
        singleRun: true
      }
    },

    /**
     * The `template` task compiles the `template.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    template: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `template.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>',
        libSrc: [
          '<%= copy.build_vendor_js.dest %>**/*.js',
          '<%= copy.build_vendor_assets.dest %>**/*.css'
        ],
        appSrc: [
          '<%= copy.build_app_js.dest %>**/*.js',
          '<%= copy.build_app_assets.dest %>**/*.css'
        ]
      }, 

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>',
        libSrc: [
          '<%= compile_dir %>/assets/*.lib.js',
          '<%= compile_dir %>/assets/*.lib.css'
        ],
        appSrc: [
          '<%= compile_dir %>/assets/<%= pkg.name %>.js',
          '<%= compile_dir %>/assets/<%= pkg.name %>.css'
        ]
      }
    },

    meta: {
      compile: {
        dir: '<%= compile_dir %>/Code'
      }
    },

    compress: {
      compile: {
        options: {
          mode: 'zip',
          archive: '<%=compile_dir%>/<%=metadata.solutionpackage.name || pkg.name %>.zip'
        },
        files: [
          {
            cwd: '<%= compile_dir %>/Code/',
            src: ['**'],
            expand: true
          }
        ]
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [ 
          '<%= vendor_files.js %>',
          '<%= test_files.js %>',
          '<%= app_files.js %>',
          '<%= app_files.jsunit %>'
        ]
      }
    },

    protractorconfig: [
      '<%= app_files.jspro %>'
    ],

    protractor: {
      all: {
        options: {
          configFile: '<%= build_dir %>/protractor.conf.js'
        }
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed 
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files. 
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: [ 'jshint:gruntfile' ],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      jssrc: {
        files: [ 
          '<%= app_files.js %>'
        ],
        tasks: [ 'jshint:app', 'karmaconfig', 'karma:continuous:run', 'copy:build_app_js' ]
      },

      /**
       * When our CoffeeScript source files change, we want to run lint them and
       * run our unit tests.
       */
      coffeesrc: {
        files: [ 
          '<%= app_files.coffee %>'
        ],
        tasks: [ 'coffeelint:src', 'coffee:source', 'karmaconfig','karma:continuous:run', 'copy:build_app_js' ]
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [ 
          '<%= app_files.assets %>'
        ],
        tasks: [ 'copy:build_app_assets', 'copy:build_vendor_assets' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      sass: {
        files: [ '<%= app_files.sass %>' ],
        tasks: [ 'sass:build' ]
      },

      css: {
        files: [ '<%= app_files.css %>' ],
        tasks: [ 'copy:build_app_assets' ]
      },

      /**
       * When template.html changes, we need to compile it.
       */
      html: {
        files: [ '<%= app_files.html %>' ],
        tasks: [ 'template:build' ]
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: [ 'jshint:test', 'karmaconfig','karma:continuous:run' ],
        options: {
          livereload: false
        }
      },

      /**
       * When a CoffeeScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      coffeeunit: {
        files: [
          '<%= app_files.coffeeunit %>'
        ],
        tasks: [ 'coffeelint:test', 'karmaconfig', 'karma:continuous:run' ],
        options: {
          livereload: false
        }
      }
    }
  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig, metaConfig ) );
  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build_no_test','connect:delta','alltests','karma:continuous', 'delta' ]);

  grunt.registerTask('lint',['clean:lint','mkdir','jshint']);
  grunt.registerTask('test',['clean:test','mkdir','karmaconfig','karma:unit']);
  grunt.registerTask('alltests',['test','protractorconfig','protractor']);
  grunt.registerTask('document',['clean:doc','ngdocs']);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'build', 'compile' ] );

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build_no_test', [
    'clean:all', 'mkdir','jshint', 'coffeelint', 'coffee', 'sass:build',
    'copy:build_app_assets','copy:build_app_js',
    'copy:build_vendor_assets','copy:build_vendor_js','template:build'
  ]);

   /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', ['connect:singleRun','build_no_test','alltests']);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'clean:compile','copy:compile_assets', 'concat:compile_app_css', 'concat:compile_app_js', 'concat:compile_vendor_css', 'concat:compile_vendor_js', 'ngAnnotate',
    'comments','cssmin', 'uglify', 'template:compile', 'clean:release', 'meta', 'compress'
  ]);

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.js$/ );
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS ( files ) {
    return files.filter( function ( file ) {
      return file.match( /\.css$/ );
    });
  }

  /** 
   * The template.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'template', 'Process template.html template', function () {
    var dirRE = new RegExp( '^('+grunt.config('build_dir')+'|'+grunt.config('compile_dir')+')\/', 'g' );
    var translateRE = new RegExp('(#mastercontrol\\.translate\\..*?\\.(.*?)(#))','g');
    var libJSFiles = filterForJS(grunt.file.expand(this.data.libSrc));
    var jsFiles = filterForJS(grunt.file.expand(this.data.appSrc));
    var libCSSFiles = filterForCSS(grunt.file.expand(this.data.libSrc));
    var cssFiles = filterForCSS(grunt.file.expand(this.data.appSrc));
    var isBuild = (this.target.indexOf('build') !== -1);
    var isWatch = !!grunt.config('isWatch');

    var cssTpl = (isBuild)?'tpls.buildCSSTemplate':'tpls.compileCSSTemplate';
    var jsTpl = (isBuild)?'tpls.buildJSTemplate':'tpls.compileJSTemplate';

    if (!!grunt.option('shorten-translations')) {
      jsFiles.forEach(function(file) {
        grunt.file.copy(file,file, {
          process: function(contents, path) {
            return contents.replace(translateRE,'$2');
          }
        });
      });
    }

    grunt.file.copy('src/template.html', this.data.dir + '/template.html', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            cssTemplate: grunt.template.process(grunt.config.getRaw(cssTpl), {
              data: {
                libStyles: libCSSFiles,
                styles: cssFiles,
                dirRE: dirRE,
                version: grunt.config( 'pkg.version' )
              }
            }),
            jsTemplate: grunt.template.process(grunt.config.getRaw(jsTpl), {
              data: {
                libScripts: libJSFiles,
                scripts: jsFiles,
                dirRE: dirRE,
                version: grunt.config( 'pkg.version' )
              }
            }),
            isWatch: isWatch
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );
    
    grunt.file.copy( 'karma/karma.conf.js', grunt.config( 'build_dir' ) + '/karma.conf.js', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

  grunt.registerMultiTask( 'protractorconfig', 'Process protractor config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );
    
    grunt.file.copy( 'protractor/protractor.conf.js', grunt.config( 'build_dir' ) + '/protractor.conf.js', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            baseURL: grunt.config('protractorURL') + '/' + grunt.config( 'build_dir' ) + '/template.html',
            specs: jsFiles,
            reportDir: grunt.config('test_report_dir')
          }
        });
      }
    });
  });
};