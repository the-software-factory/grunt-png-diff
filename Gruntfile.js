/*
 * grunt-png-diff
 * https://github.com/mbellagamba/png-diff
 *
 * Copyright (c) 2015 Mirco Bellagamba
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'lib/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/output']
    },

    // Configuration to be run (and then tested).
    png_diff: {
      default_options: {
        options: {
          reference: 'img0.png',
          antiAliasing: true,
          threshold: 0.05,
          tolerance: 10

        },
        origin: 'test/fixtures',
        destination: 'test/output'
      },
      recursive_options: {
        options: {
          reference: 'OS X 10.10chrome.png',
          antiAliasing: true,
          threshold: 0.1,
          tolerance: 10
        },
        origin: 'test/recursive',
        destination: 'test/output'
      }
    },
    shell: {
      jasmine: {
        command: 'node node_modules/istanbul/lib/cli.js cover node_modules/jasmine/bin/jasmine.js JASMINE_CONFIG_PATH=test/jasmine.json'
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'png_diff', 'shell:jasmine']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
