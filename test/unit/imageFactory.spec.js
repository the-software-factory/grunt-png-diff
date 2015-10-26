describe('Image Factory', function() {
  'use strict';

  var PNG = require('pngjs').PNG;
  var ImageFactory = require('../../lib/imageFactory');
  var factory;

  beforeEach(function() {
    factory = new ImageFactory();
  });

  it('should create a PNG image', function() {
    var png = factory.createImage({type:'png'});
    expect(png instanceof PNG).toBeTruthy();
  });

  it('should pass the creation options', function(){
    spyOn(factory, 'imageClass');
    var options = {width: 100, height:100};
    factory.createImage(options);
    expect(factory.imageClass).toHaveBeenCalledWith(options);
  });
});
