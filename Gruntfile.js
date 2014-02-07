'use strict';

module.exports = function(grunt) {

  // Project Config
  var config = {
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author_name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    // --- FULL JS ---
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },

      essential: {
        src: [
          'bower_components/essentialjs-future/js/modernizr-custom.js',
          'bower_components/essentialjs-future/essential.js'
        ],
        dest: 'js/modernizr+essential.js'
      },

      app: {
        src: [
          // 'bower_components/essentialjs-future/app/js/spin.min.js',
          '_libs/uri.js',
          '_libs/impl.js',
          '_libs/form.js',
          'bower_components/fluent-books/books.js',
          '_libs/app.js'
        ],
        dest: 'js/uri+impl+form+app.js'
      },
    },

    // --- MINIFIED JS ---
    uglify: {
      options: {
        banner: '<%= banner %>'
      },

      essential: {
        files: {
          'js/modernizr+essential.min.js': [
            'js/modernizr-custom.js',
            '_libs/essential.js'
          ]
        }
      },

      app: {
        files: {
          'js/uri+impl+form+app.min.js': [
            '_libs/uri.js',
            '_libs/impl.js',
            '_libs/form.js',
            '_libs/app.js'
          ]
        }
      },

      jquery: {
        files: {
          'js/jquery.min.js': 'bower_components/jquery/jquery.js'
        }
      },

      bootstrap: {
        files: {
          'js/bootstrap.min.js': [
            'bower_components/bootstrap/js/collapse.js',
            'bower_components/bootstrap/js/scrollspy.js',
            'bower_components/bootstrap/js/button.js',
            'bower_components/bootstrap/js/affix.js'
          ]
        }
      }
    },

    // --- COPY ---
    copy: {
      fluent: {
        files: [
          {
            expand: true, 
            cwd: '../books/',
            src: ['*.js','*.less','*.css'],
            dest: 'bower_components/fluent-books/'
          },
          {
            expand: true, 
            cwd: '../books/css/',
            src: ['*.less','*.css'],
            dest: 'bower_components/fluent-books/css/'
          },
          {
            expand: true, 
            cwd: '../books/js/',
            src: '*.js',
            dest: 'bower_components/fluent-books/js/'
          }
        ]
      },

      mediaelement: {
        files: [
          {
            expand: true, flatten: true,
            cwd: 'bower_components/mediaelement/build/',
            src: ['*.swf','*.xap'],
            dest: 'js/'
          }
        ]
      }
    },

    qunit: {
      files: ['test/**/*.html']
    },

    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '_libs/.jshintrc'
        },
        src: ['_libs/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },


    less: {
      dev: {
        options: {
          paths: [
            "./bower_components",
            "./_less"],
          yuicompress: true
        },
        files: {
          './css/mobile.min.css': './css/mobile.less',
          './css/enhanced.min.css': './css/enhanced.less'
        }
      },

      dist: {
        options: {
          paths: ["assets/less/bootstrap/less"],
          yuicompress: true
        },
        files: {
          'css/mobile.min.css': 'css/mobile.less',
          'css/enhanced.min.css': 'css/enhanced.less'
        }
      }
    },

    // sass: {
    //   dist: {
    //     options: {
    //       outputStyle: 'compressed'
    //     },
    //     files: {
    //       'assets/css/main.css': 'assets/sass/main.scss'
    //     }
    //   },
    //   dev: {
    //     options: {
    //       style: 'expanded'
    //     },
    //     src: ['assets/sass/main.scss'],
    //     dest: 'assets/css/main.css'
    //   }
    // },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },

      fluent: {
        files: ['../books/**/*.js','../books/**/*.css','../books/**/*.less'],
        tasks: 'copy:fluent'
      },

      less: {
        files: ['_less/*.less','assets/less/**/*.less',"./css/*.less"],
        tasks: 'less:dev'
      },
      sass: {
        files: ['assets/sass/partials/**/*.scss', 'assets/sass/modules/**/*.scss',"./css/*.scss"],
        tasks: 'sass:dev'
      },
      scripts: {
        files: ['_libs/*.js', 'assets/lib/**/*.js','bower_components/**/*.js'],
        tasks: [
          //'jshint',
          'concat:essential','concat:app'],
        options: {
          spawn: false
        }
      }
    },

    modernizr: {

        // [REQUIRED] Path to the build you're using for development.
        "devFile" : "_libs/modernizr-latest.js",

        // [REQUIRED] Path to save out the built file.
        "outputFile" : "js/modernizr-custom.js",

        // Based on default settings on http://modernizr.com/download/
        "extra" : {
            "shiv" : true,
            "printshiv" : false,
            "load" : true,
            "mq" : false,
            "cssclasses" : true
        },

        // Based on default settings on http://modernizr.com/download/
        "extensibility" : {
            "addtest" : false,
            "prefixed" : true,
            "teststyles" : false,
            "testprops" : false,
            "testallprops" : false,
            "hasevents" : true,
            "prefixes" : false,
            "domprefixes" : false
        },

        // By default, source is uglified before saving
        "uglify" : true,

        // Define any tests you want to implicitly include.
        "tests" : [
          // 'csstransform3d',
          'backgroundsize',
          'csscolumns',
          'hashchange',
          'draganddrop',
          'touch',
          'websockets',

          'file_api',
          // 'file_filesystem',
          // 'fullscreen_api',
          'ie8compat',
          'css-calc',
          'css-regions',
          'css-positionsticky'

        ],

        // By default, this task will crawl your project for references to Modernizr tests.
        // Set to false to disable.
        "parseFiles" : false,

        // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
        // You can override this by defining a "files" array below.
        // "files" : [],

        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        "matchCommunityTests" : false,

        // Have custom Modernizr tests? Add paths to their location here.
        "customTests" : []
    },

    jekyll: {
      dev: {
        options: {
          serve: true,
          watch: true
        }
      }
    },

    concurrent: {
      tasks: ['watch:less',/*'watch:sass',*/ 'watch:scripts', 'jekyll:dev'],
      options: {
        logConcurrentOutput: true
      }
    },

    exec: {
      bowerinstall: {
        cmd:"bower install"
      }
    }

  };

  if (grunt.file.exists("../books/")) {
    // grunt.log.writeln("fluent books found");
    config.concurrent.tasks.push("watch:fluent");
  }

  grunt.initConfig(config);

  // Load Plugins
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-exec');

  // Default Task
  grunt.registerTask('default', ['less:dev','concat:essential','concat:app','concurrent']);
  grunt.registerTask('install', ['exec:bowerinstall','modernizr','copy:mediaelement']);
  grunt.registerTask('build', ['modernizr','jshint','copy:mediaelement',
    'qunit','concat','uglify']);
  grunt.registerTask('serve', ['jekyll:dev']);
};