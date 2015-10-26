describe('Png Diff', function () {
  'use strict';

  var fs = require('fs'),
    PNG = require('pngjs').PNG;
  var outputDir = 'test/output/', expectedDir = 'test/expected/';

  function test(actual, expected, callback) {
    var img1, img2;

    function onParsed() {
      if (!img1.data || !img2.data) {
        return;
      }
      callback(img1, img2);
    }

    img1 = fs.createReadStream(actual)
      .pipe(new PNG())
      .on('parsed', onParsed);
    img2 = fs.createReadStream(expected)
      .pipe(new PNG())
      .on('parsed', onParsed);
  }

  it('should write in output the comparison', function (done) {
    var filename = 'matchimg1.png';
    test(outputDir + filename, expectedDir + filename, function(actual, expected) {
      expect(actual.data).toEqual(expected.data);
      done();
    });
  });

  it('should write in output the comparison', function (done) {
    var filename = 'matchimg2.png';
    test(outputDir + filename, expectedDir + filename, function(actual, expected) {
      expect(actual.data).toEqual(expected.data);
      done();
    });
  });

});
