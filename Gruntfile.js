module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        // !! You can drop your app.build.js config wholesale into 'options'
        options: {
          //appDir: "src/",
          //baseUrl: ".",
          //dir: "target/",
          //optimize: 'uglify',
          //mainConfigFile: './src/main.js',
          //modules: [
          //  {
          //      name: 'MyModule'
          //  }
          //],
          //logLevel: 0,
          //findNestedDependencies: true,
          //fileExclusionRegExp: /^\./,
          //inlineText: true

          baseUrl: './scripts/tetris',
          include: ['../lib/almond/almond'],
          //include: ['../lib/require/require'],
          //wrap: true,
          paths: {
            require: '../lib/require/require',
            text: '../lib/require/text',
            jquery: '../lib/jquery/jquery-2.1.4.min',
            jqueryui: '../lib/jqueryui/jquery-ui',
            underscore: '../lib/underscore/underscore',
            can: '../lib/canjs/can.custom',
            backbone: '../lib/backbone/backbone'
          },
          name: 'main',
          out: '../Web/scripts/tetris-min.js',
          shim: {
            can: {
              deps: ['jquery'],
              exports: 'can'
            },
            underscore: {
              exports: '_'
            },
            backbone: {
              deps: ['jquery', 'underscore'],
              exports: 'Backbone'
            },
            jquery: {
              exports: '$'
            }
          }
        }
      }
    },

    processhtml: {
      options: {
        data: {
          message: 'Hello world!'
        }
      },
      dist: {
        files: {
          '../Web/index.html': ['index.html']
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      dist: {
        files: {
          '../Web/styles/tetris-min.css': [
            'styles/tetris.css',
            'styles/smoothness/jquery-ui.css'
          ]
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['styles/smoothness/images/*'], dest: '../Web/styles/images/',
            filter: 'isFile'
          },
          {
            expand: true,
            flatten: true,
            src: ['styles/glyphicons/*'], dest: '../Web/styles/glyphicons/',
            filter: 'isFile'
          },
          {
            expand: true,
            flatten: true,
            src: ['media/*'], dest: '../Web/media/',
            filter: 'isFile'
          },
        ],
      },
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['requirejs', 'cssmin', 'processhtml', 'copy']);
};
