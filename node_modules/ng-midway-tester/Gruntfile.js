module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');

  grunt.initConfig({
    shell: {
      options: {
        stdout: true
      },
      docs: {
        command: './node_modules/.bin/yuidoc -o ./docs ./src'
      },
      npm_install: {
        command: 'npm install'
      },
      bower_install: {
        command: 'node ./node_modules/bower/bin/bower install'
      },
    },

    connect: {
      docs: {
        options: {
          base: 'docs/',
          port: 8888,
          keepalive: true
        }
      },
      coverage: {
        options: {
          base: 'coverage/',
          port: 5555,
          keepalive: true
        }
      },
      test: {
        options: {
          base: './',
          port: 8844
        }
      }
    },

    open: {
      docs: {
        path: 'http://localhost:8888'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },

    karma: {
      test: {
        configFile: './test/karma.conf.js',
        autoWatch: false,
        singleRun: true
      },
      auto: {
        configFile: './test/karma.conf.js',
        autoWatch: true,
        singleRun: false
      },
      ci: {
        configFile: './test/karma.conf.js',
        browsers: ['PhantomJS'],
        autoWatch: false,
        singleRun: true
      },
      coverage: {
        configFile: './test/karma.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'src/ngMidwayTester.js': ['coverage']
        },
        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
      }
    }
  });

  //single run tests
  grunt.registerTask('test', ['connect:test','karma:test']);
  grunt.registerTask('travis', ['connect:test','karma:ci']);
  grunt.registerTask('autotest', ['connect:test','karma:auto']);
  grunt.registerTask('coverage', ['install','connect:test','karma:coverage','open:coverage','connect:coverage']);
  grunt.registerTask('docs', ['gen-docs','open:docs','connect:docs']);
  grunt.registerTask('gen-docs', ['install','shell:docs']);
  grunt.registerTask('install', ['shell:npm_install','shell:bower_install']);
};
