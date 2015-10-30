'use strict';

// TODO import as node_modules when updated npm package is available
var pixelmatch = require('./pixelmatch');
var fs = require('fs');
var hasExtension = require('./utility').hasExtension;
var addSlashIfMissing = require('./utility').addSlashIfMissing;

/**
 * Create an object able to compare image in the origin directory an send the comparison output to the destination
 * directory.
 * @param {ImageFactory} imageFactory the image factory.
 * @param {string} originDir the directory that contains png to compare.
 * @param {string} destinationDir the directory where output will be saved.
 * @constructor
 */
function Comparator(imageFactory, originDir, destinationDir) {
  this.factory = imageFactory;
  this.pngDir = addSlashIfMissing(originDir);
  this.outDir = addSlashIfMissing(destinationDir);

  var files = fs.readdirSync(originDir);
  this.files = files.filter(function (file) {
    return hasExtension(file, 'png');
  });
}

/**
 * Compares images in the origin directory with the reference, then calls the callback when the elaboration is
 * completed. The callback is called with the array of result get from the image comparisons. Each item of the array
 * has the following structure.
 * {
 *  filename: "example.png",
 *  error: 5.32,
 *  differentPixels: 123
 * }
 * @param {string} reference the file name of the reference image.
 * @param {Object} options the comparison options, e.g. { threshold: 0.1, antiAliasing: false }.
 * @param {Function} callback the function called at the end of processing. The only parameter is the array of results.
 */
Comparator.prototype.compare = function (reference, options, callback) {
  var comparator = this;
  var comparisons = [];

  if (options instanceof Function) {
    callback = options;
    options = {};
  }

  var files = comparator.files.filter(function (file) {
    return file !== reference;
  });

  var img1 = fs.createReadStream(comparator.pngDir + reference).pipe(comparator.factory.createImage({type: 'png'}));
  img1.on('parsed', function () {

    var processEnded = 0;

    files.forEach(function (file, index, files) {
      var img2 = fs.createReadStream(comparator.pngDir + file).pipe(comparator.factory.createImage({type: 'png'}));
      img2.on('parsed', function doneReading() {
        if (!img1.data || !img2.data) {
          return;
        }

        // Represents the difference between the compared images
        var differenceImage = comparator.factory.createImage({type: 'png', width: this.width, height: this.height});
        // Number of different pixels
        var differentPixels = pixelmatch(img1.data, this.data, differenceImage.data, this.width, this.height, options);

        // Error in percentage
        var error = Math.round(100 * 100 * differentPixels / (differenceImage.width * differenceImage.height)) / 100;
        comparisons[index] = {
          filename: file,
          error: error,
          differentPixels: differentPixels
        };

        var outputStream = differenceImage.pack().pipe(fs.createWriteStream(comparator.outDir + 'match' + file));

        outputStream.on('finish', function () {
          processEnded++;
          if (processEnded === files.length) {
            var result = {
              origin: comparator.pngDir,
              destination: comparator.outDir,
              comparisons: comparisons
            };
            callback(result);
          }
        });

      });

    });
  });
};

module.exports = Comparator;
