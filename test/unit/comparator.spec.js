describe('Comparator', function () {
  'use strict';

  var Comparator = require('../../lib/comparator');
  var comparator, origDir = 'orig/', destDir = 'dest/';
  var helperMatch = {
    pixelmatch: require('../../lib/pixelmatch')
  };
  var fs = require('fs');
  var helperPngjs = {
    PNG:require('pngjs').PNG
  };
  var stream, mockFactory;

  beforeEach(function () {
    stream = jasmine.createSpyObj('stream',['pipe', 'on', 'pack']);
    stream.data = 'some data';
    stream.width = 100;
    stream.height = 100;
    stream.pipe.and.returnValue(stream);
    stream.pack.and.returnValue(stream);
    stream.on.and.callFake(function (event, callback) {
      if(callback instanceof Function){
        stream.fakeOn = callback;
        stream.fakeOn();
      }
    });

    mockFactory = jasmine.createSpyObj('mockFactory',['createImage']);
    mockFactory.createImage.and.returnValue(stream);

    var png = jasmine.createSpyObj('png',['pack']);
    png.width = 100;
    png.height = 100;
    png.pack.and.returnValue(stream);

    spyOn(helperPngjs, 'PNG').and.returnValue(png);
    spyOn(fs, 'createReadStream').and.returnValue(stream);
    spyOn(fs, 'createWriteStream').and.returnValue(stream);
    spyOn(fs, 'readdirSync').and.returnValue(['img1.png', 'img2.png', 'img3.png', 'text.txt']);
    comparator = new Comparator(mockFactory, origDir, destDir);
  });

  it('should filter PNG files', function(){
    expect(comparator.files).not.toContain('text.txt');
  });

  it('should call the callback at the end of the comparison', function() {
    var spyCallback = jasmine.createSpy('callback');
    comparator.compare('ref.png', {}, spyCallback);
    expect(fs.createWriteStream).toHaveBeenCalledWith('dest/matchimg1.png');
    expect(fs.createWriteStream).toHaveBeenCalledWith('dest/matchimg2.png');
    expect(fs.createWriteStream).toHaveBeenCalledWith('dest/matchimg3.png');
    expect(spyCallback).toHaveBeenCalled();
  });
});
