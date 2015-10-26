'use strict';

var utility = (function () {

  /**
   * Returns the file extension. For an explanation of how it works refer to
   * http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
   * @param {string} filename the file name.
   * @returns {string} the file extension.
   */
  var getExtension = function (filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  };

  /**
   * Returns true if the file name has .png extension.
   * @param {string} filename the file name.
   * @param {string} extension the file extension.
   * @returns {boolean} true if the parameter is PNG file name.
   */
  var hasExtension = function (filename, extension) {
    return getExtension(filename) === extension;
  };

  return {
    getExtension: getExtension,
    hasExtension: hasExtension
  };
})();

module.exports = utility;
