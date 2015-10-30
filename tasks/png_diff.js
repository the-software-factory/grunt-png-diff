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
  var DirChecker = require('../lib/dirChecker');
  var addSlashIfMissing = require('../lib/utility').addSlashIfMissing;
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
      recursive: false,
      resize: false
    });

    // Resolve paths
    var origin = process.cwd() + '/' + this.data.origin + '/';
    var destination = process.cwd() + '/' + this.data.destination + '/';
    var origCheck = new DirChecker(origin);
    // Count total comparison to do. If count is 0, then the origin directory does not have any sub-directory so it is
    // set to 1, because only one comparison is needed.
    var compareCount = origCheck.countFileSubDirsRecursive() || 1;
    var testCount = compareCount;

    grunt.file.mkdir(destination);

    var failures = 0;
    var okReport = '', failReport = '';

    /**
     * Displays a final report of the test. If any test failed, logs filename and error. It finally calls the callback
     * `done`, to make aware grunt the execution is finished.
     */
    function displayTotalResult() {
      grunt.log.writeln();

      var returnValue = 0;

      if (failures !== 0) {
        grunt.log.write(failReport['red']);
        returnValue = new Error(failures + '/' + testCount + ' tests failed. See failing images above.');
        grunt.fail.warn(returnValue);
      } else {
        grunt.log.write(okReport);
        grunt.log.ok('OK, ' + testCount + '/' + testCount + ' tests passed.');
      }
      // End the grunt task
      done(returnValue);
    }

    /**
     * Displays the result for each single test, then it calls the final report if there aren't any comparison to do.
     * @param {Object} diffResults the result of comparison.
     */
    function displayResults(diffResults) {
      var shotsDir = diffResults.origin.replace(origin, '');
      diffResults.comparisons.forEach(function (result) {
        if (result.error <= options.tolerance) {
          grunt.log.write('.'['green']);
          okReport += shotsDir + result.filename + ' fulfilled expectations.\n' +
            'Error: ' + result.error + '%\n' +
            'Number of different pixels: ' + result.differentPixels + '\n\n';
        } else {
          grunt.log.write('F'['red']);
          failures++;
          failReport += failures + '. ' + shotsDir + result.filename + ' failed expectations.\n' +
            'Error: ' + result.error + '%\n' +
            'Number of different pixels: ' + result.differentPixels + '\n\n';
        }
      });

      compareCount--;
      if (compareCount === 0) {
        displayTotalResult();
      }
    }

    /**
     * Compare PNG inside the origin folder, then calls the display result function.
     * @param {string} origin the directory where images are in.
     * @param {string} destination the directory where to save the comparison result.
     */
    function screenShotsCompare(origin, destination) {

      var compare = function () {
        var comparator = new Comparator(new ImageFactory(), origin, destination);

        // Handle options
        var comparisonOptions = {};
        if (options.threshold) {
          comparisonOptions.threshold = options.threshold;
        }
        if (options.antiAliasing) {
          comparisonOptions.antiAliasing = options.antiAliasing;
        }
        comparator.compare(options.reference, comparisonOptions, displayResults);
      };

      // Handle resize options and start comparison
      if (options.resize) {
        resizer.resizeAsTheSmallest(origin, compare);
      } else {
        compare();
      }
    }

    /**
     * Search recursively directories containing images. Where is found a valid directory, start the comparison.
     * @param {string} origin the directory where images are in.
     * @param {string} destination the directory where to save the comparison result.
     */
    function screenShotsCompareRecursive(origin, destination) {
      origin = addSlashIfMissing(origin);
      destination = addSlashIfMissing(destination);
      var files = grunt.file.expand({cwd: origin}, '*');
      if (files.length === 0) {
        compareCount--;
        return;
      }
      grunt.file.mkdir(destination);

      var dirChecker = new DirChecker(origin);
      if (!dirChecker.containsDir(origin)) {
        screenShotsCompare(origin, destination);
      } else {
        var dirs = dirChecker.getDirs();
        for (var i = 0; i < dirs.length; i++) {
          screenShotsCompareRecursive(origin + dirs[i], destination + dirs[i]);
        }
      }
    }

    // Start task
    screenShotsCompareRecursive(origin, destination);
  });

};
