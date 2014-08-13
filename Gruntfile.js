'use strict';

module.exports = function(grunt) {

  // Project Config
  var config = {
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy") %>\n' +
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
          '_libs/prefix.js',
          'components/essentialjs/js/modernizr-custom.js',
          // 'components/es5-shim/es5-shim.min.js',          
          'components/es5-shim/es5-shim.js',          
          'components/essentialjs/essential.js',
          '_libs/head.js'
        ],
        dest: 'js/modernizr+essential.js'
      },

      mods: {
        src: [
          'components/angular-toggle-switch/angular-toggle-switch.js',
          'components/tv4/tv4.js',
          '../libs/html5-audio-read-along/read-along.js',
          '_libs/angular-mods.js'
        ],
        dest: 'js/angular-mods.js'
      },

      serverDev: {
        src: [
          '../libs/simperium-js/simperium-dev.js'
        ],
        dest: 'js/server.js'
      },

      server: {
        src: [
          '../libs/simperium-js/simperium.js'
        ],
        dest: 'js/server.min.js'
      },

      app: {
        src: [
          // 'components/essentialjs/app/js/spin.min.js',
          '_libs/uri.js',
          '_libs/impl.js',
          '_libs/form.js',
          '../libs/book-reader/books.js',
          '../libs/book-reader/controllers.js',
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

      mods: {
        files: {
          'js/angular-mods.min.js': [
            'components/angular-toggle-switch/angular-toggle-switch.min.js',
            'components/tv4/tv4.js',
            '../libs/html5-audio-read-along/read-along.js',
            '_libs/angular-mods.js'
          ]
        }
      }
      /*
      ,

      bootstrap: {
        files: {
          'js/bootstrap.min.js': [
            'components/bootstrap/js/collapse.js',
            'components/bootstrap/js/scrollspy.js',
            'components/bootstrap/js/button.js',
            'components/bootstrap/js/affix.js'
          ]
        }
      }
      */
    },

    // --- COPY ---
    copy: {
      angular: {
        files: [
          { src: 'components/angular/angular.js', dest: 'js/angular.js' },
          { src: 'components/angular/angular.min.js', dest: 'js/angular.min.js' },
          { src: 'components/angular/angular.min.js.map', dest: 'js/angular.min.js.map' },
          { src: 'components/jquery/jquery.js', dest: 'js/jquery.js' },
          { src: 'components/jquery/jquery.min.js', dest: 'js/jquery.min.js' },
          { src: 'components/jquery/jquery.min.js.map', dest: 'js/jquery.min.js.map' }
        ]
      },

      //TODO build maps
      app_map: {
        files: [
          { src: 'components/es5-shim/es5-shim.js', dest: 'js/es5-shim.js' },
          { src: 'components/es5-shim/es5-shim.map', dest: 'js/es5-shim.map' }
        ]
      },

      mediaelement: {
        files: [
          {
            expand: true, flatten: true,
            cwd: 'components/mediaelement/build/',
            src: ['*.swf','*.xap'],
            dest: 'js/'
          }
        ]
      }
    },

    responsive_videos: {
      assets: {

        options: {
          sizes: [
            {name:"small",width:320,filter:'',poster:true},
            {name:"480p", width:960, height:480,filter:'',poster:true}
            // ,
            // {name:"720p", width:1920, height:720,filter:'',poster:true}
          ]
        },

        files: [{
          expand: true,
          cwd: 'assets/',
          src: 'max/*.{mp4,mov}',
          dest: 'assets/video/'
        }] 
      }
    },

    browserify: {
      product: {
        src: '_libs/product-app.js',
        dest: 'js/product-app.js'
      },
      speak: {
        src: '_libs/speak.js',
        dest: 'js/speak.js'
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
            "./components",
            "./_less"
            ]
        },
        files: {
          './css/mobile.css': './css/mobile.less',
          './css/enhanced.css': './css/enhanced.less'
        }
      },

      dist: {
        options: {
          paths: [
            "./components",
            "./_less"
          ],
          compress: true,
          cleancss: true,
          report: true
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

    typescript: {
      body: {
        src: ['_libs/body.ts'],
        dest: 'js/body.js',
        options: {
          // watch: true,
          // after: [tasks]
          basePath: '_libs',
          target: 'es5' //or es3
        }
      }
    },

    watch: {
      // options: {
      //   livereload: true
      // },

      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },

      html: {
        files: ['**/*.html','js/*.js','css/*.css','assets','fonts','images'],
        tasks: ['jekyll:dev']
      },

      less: {
        files: ['_less/*.less','assets/less/**/*.less',"./css/*.less","components/**/*.less"],
        tasks: ['less:dev','less:dist','jekyll:dev']
      },
      // sass: {
      //   files: ['assets/sass/partials/**/*.scss', 'assets/sass/modules/**/*.scss',"./css/*.scss"],
      //   tasks: 'sass:dev'
      // },
      typescript: {
        files: ['Gruntfile.js','**/*.ts','../libs/book-reader/*.ts'],
        tasks: ['typescript','jekyll:dev']
      },
      scripts: {
        files: ['_libs/*.js', 'assets/lib/**/*.js' /*,'components/** /*.js'*/],
        tasks: [
          //'jshint',
          // 'browserify', //TODO gotta go
          'concat:essential','concat:mods', 'concat:server', 'concat:serverDev',
          'jekyll:dev'
          ],

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
      options: {
        // bundleExec: true
        // ,src: '<%= app %>'
      },

      dev: {
        options: {
          dest: '../fluentglobe_site',
          config: ['_config.yml','_config_dev.yml']
        }
      },

      dist: {
        options: {
          dest: '../fluentglobe_site',
          config: '_config.yml'
        }
      },

      serve: {
        options: {
          serve: true,
          drafts: true,
          watch: true
        }
      }
    },

    connect: {
      server: {
        options: {
          keepalive: true,
          hostname: '*',
          // livereload: true,
          base: '../fluentglobe_site/',
          port: 4400
        }
      }
    },

    concurrent: {
      tasks: ['connect:server' , 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

    exec: {
      bowerinstall: {
        cmd:"bower install"
      },
      simperiuminstall: {
        cmd:"cd ../libs/simperium-js;make"
      },
    
      ffmpeg: {
        cmd: "brew install ffmpeg --with-libvorbis --with-nonfreee --with-gpl --with-libvpx --with-pthreads --with-libx264 --with-libfaac --with-theora --with-libogg"
      }
    }

  };

  if (grunt.file.exists("../books/")) {
    // grunt.log.writeln("fluent books found");
    config.concurrent.tasks.push("watch:fluent");
  }

  grunt.initConfig(config);

  // Load Plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
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
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-responsive-videos');

  // Default Task
  grunt.registerTask('default', [
    'browserify','copy','uglify',
    'less:dev','less:dist',
    'typescript',
    'concat:essential','concat:mods','concat:server','concat:serverDev','jekyll:dev',
    'concurrent']
    );
  grunt.registerTask('install', [
    'exec:bowerinstall','exec:simperiuminstall',
    'modernizr','copy:mediaelement','exec:ffmpeg'
    ]);
  grunt.registerTask('build', ['clean','modernizr','jshint','copy:mediaelement',
    'qunit','concat',
    'uglify','typescript','jekyll:dist' //TODO should there be a dist typescript build
    ]);
  grunt.registerTask('serve', ['jekyll:serve']);
};