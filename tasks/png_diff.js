/*
 * grunt-png-diff
 * https://github.com/mbellagamba/png-diff
 *
 * Copyright (c) 2015 Mirco Bellagamba
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  var Comparator = require('../lib/comparator');
  var resizer = require('../lib/resizer');
  var ImageFactory = require('../lib/imageFactory');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('png_diff', 'Runs a test which compare images', function () {

    // Make the task wait for asynchronous execution
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      reference: 'reference.png',
      tolerance: 10,
      resize: false
    });

    // Resolve paths
    var origin = process.cwd() + '/' + this.data.origin + '/';
    var destination = process.cwd() + '/' + this.data.destination + '/';

    grunt.file.mkdir(destination);

    function startComparison() {
      var comparator = new Comparator(new ImageFactory(), origin, destination);

      // Handle options
      var comparisonOptions = {};
      if (options.threshold) {
        comparisonOptions.threshold = options.threshold;
      }
      if (options.antiAliasing) {
        comparisonOptions.antiAliasing = options.antiAliasing;
      }

      // Start comparison
      comparator.compare(options.reference, comparisonOptions, function (comparisons) {

        var failures = 0;
        var okReport = '', failReport = '';

        comparisons.forEach(function (result) {
          if (result.error <= options.tolerance) {
            grunt.log.write('.'['green']);
            okReport += result.filename + ' fulfilled expectations.\n' +
              'Error: ' + result.error + '%\n' +
              'Number of different pixels: ' + result.differentPixels + '\n';
          } else {
            grunt.log.write('F'['red']);
            failures++;
            failReport += failures + '. ' + result.filename + ' failed expectations.\n' +
              'Error: ' + result.error + '%\n' +
              'Number of different pixels: ' + result.differentPixels + '\n';
          }
        });

        grunt.log.writeln();

        var returnValue = 0;

        if (failures !== 0) {
          grunt.log.write(failReport['red']);
          returnValue = new Error(failures.length + '/' + comparisons.length + ' tests failed. See failing images above.');
          grunt.fail.warn(returnValue);
        } else {
          grunt.log.write(okReport);
          grunt.log.ok('OK, ' + comparisons.length + '/' + comparisons.length + ' tests passed.');
        }
        // End the grunt task
        done(returnValue);
      });
    }

    // Handle resize options and start comparison
    if (options.resize) {
      resizer.resizeAsTheSmallest(origin, startComparison);
    } else {
      startComparison();
    }

  });

};
