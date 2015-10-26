var PNG = require('pngjs').PNG;

function ImageFactory() {
}

ImageFactory.prototype.imageClass = PNG;

ImageFactory.prototype.createImage = function (options) {

  switch (options.type) {
    case "png":
      this.imageClass = PNG;
      break;
    //case "jpeg":
    //  this.imageType = JPEG;
    //  break;
    //defaults to ImageFactory.prototype.imageClass (PNG)
  }

  return new this.imageClass(options);
};

module.exports = ImageFactory;
