var fs = require('fs');
var ImageFactory = require('./imageFactory');
var factory = new ImageFactory();
var PNGCrop = require('./pngcrop');
var hasExtension = require('./utility').hasExtension;
var addSlashIfMissing = require('./utility').addSlashIfMissing;

module.exports = {
  minSize: {},
  pngResize: function (size, dir, done) {
    var files = fs.readdirSync(dir);
    files = files.filter(function (file) {
      return hasExtension(file, 'png');
    });

    var croppedFiles = 0;
    files.forEach(function (file) {
      var cropOptions = {width: size.width, height: size.height, top: 0, left: 0};
      // pass a path, a buffer or a stream as the input
      PNGCrop.crop(dir + file, dir + file, cropOptions, function (err) {
        if (err) {
          throw err;
        }
        croppedFiles++;
        if (done && croppedFiles === files.length) {
          done();
        }
      });
    });
  },
  resizeAsTheSmallest: function (pngDir, done) {
    var self = this;
    var minSize = this.minSize;
    pngDir = addSlashIfMissing(pngDir);
    var files = fs.readdirSync(pngDir);
    files = files.filter(function (file) {
      return hasExtension(file, 'png');
    });

    var parsedFiles = 0;
    files.forEach(function (file) {
      fs.createReadStream(pngDir + file)
        .pipe(factory.createImage({
          type: 'png',
          filterType: 4
        }))
        .on('parsed', function hasMinSize() {
          if (!minSize.width || this.width < minSize.width) {
            minSize.width = this.width;
          }
          if (!minSize.height || this.height < minSize.height) {
            minSize.height = this.height;
          }
          parsedFiles++;
          if (parsedFiles === files.length) {
            // Last iteration
            self.pngResize(minSize, pngDir, done);
          }
        });
    });

  }
};
