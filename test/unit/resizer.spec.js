describe('Resizer', function () {
  'use strict';

  var resizer = require('../../lib/resizer');
  var cropper = require('../../lib/pngcrop');
  var fs = require('fs');

  beforeEach(function () {
    spyOn(fs, 'readdirSync').and.returnValue(['img1.png', 'img2.png', 'text.txt']);
  });

  it('should call the cropper properly', function (done) {
    var origDir = 'orig';
    var size = {height: 100, width: 100};
    spyOn(cropper, 'crop').and.callFake(function (file1, file2, options, callback) {
      callback();
    });

    resizer.pngResize(size, origDir, function () {
      expect(cropper.crop.calls.count()).toBe(2);
      expect(cropper.crop).toHaveBeenCalledWith(origDir + 'img1.png', origDir + 'img1.png',
        {width: size.width, height: size.height, top: 0, left: 0}, jasmine.any(Function));
      expect(cropper.crop).toHaveBeenCalledWith(origDir + 'img2.png', origDir + 'img2.png',
        {width: size.width, height: size.height, top: 0, left: 0}, jasmine.any(Function));
      done();
    });
  });

  it('should find the smallest image and resize the others', function () {
    var origDir = 'orig';
    var stream = jasmine.createSpyObj('stream', ['pipe', 'on']);
    spyOn(fs, 'createReadStream').and.returnValue(stream);
    stream.pipe.and.returnValue(stream);
    stream.on.and.callFake(function (event, callback) {
      callback();
    });
    spyOn(resizer, 'pngResize');
    resizer.resizeAsTheSmallest(origDir);
    expect(resizer.pngResize).toHaveBeenCalled();
  });
});
