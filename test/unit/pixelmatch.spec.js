describe('Pixel match', function() {
  'use strict';

  // TODO Remove this test and its fixtures when updated npm package is available

  var PNG = require('pngjs').PNG,
    fs = require('fs'),
    path = require('path'),
    match = require('../../lib/pixelmatch');

  function readImage(name, done) {
    return fs.createReadStream(path.join(__dirname, '/fixtures/' + name + '.png')).pipe(new PNG()).on('parsed', done);
  }

  function test(imgPath1, imgPath2, diffPath, threshold, includeAA, expectedMismatch, done) {
    var img1 = readImage(imgPath1, function () {
      var img2 = readImage(imgPath2, function () {
        var expectedDiff = readImage(diffPath, function () {
          var diff = new PNG({width: img1.width, height: img1.height});

          var mismatch = match(img1.data, img2.data, diff.data, diff.width, diff.height, {
            threshold: threshold,
            includeAA: includeAA
          });

          expect(diff.data).toEqual(expectedDiff.data);
          expect(mismatch).toEqual(expectedMismatch);

          done();
        });
      });
    });
  }

  it('should differ by 144 pixel', function(done){
    test('1a', '1b', '1diff', 0.03, false, 144, done);
  });

  it('should differ by 12785 pixel', function(done){
    test('2a', '2b', '2diff', 0.03, false, 12785, done);
  });

  it('should differ by 212 pixel', function(done){
    test('3a', '3b', '3diff', 0.03, false, 212, done);
  });

  it('should differ by 36383 pixel', function(done){
    test('4a', '4b', '4diff', 0.03, false, 36383, done);
  });

});
