describe('Utility', function () {
  'use strict';

  var util = require('../../lib/utility');

  it('should return true if the file extension is png', function () {
    expect(util.hasExtension('img.png', 'png')).toBe(true);
  });

  it('should return false if file extension is not png', function () {
    expect(util.hasExtension('img.js', '.png')).toBe(false);
  });

  it('should return false if file extension is missing', function () {
    expect(util.hasExtension('png', '.png')).toBe(false);
  });

  it('should get the file extension', function () {
    expect(util.getExtension('file.txt')).toEqual('txt');
  });

  it('should get the file extension in file names with many dots', function () {
    expect(util.getExtension('file.name.with.many.dots.txt')).toEqual('txt');
  });

  it('should return the empty string in file names without dots', function () {
    expect(util.getExtension('file-without-dots')).toEqual('');
  });

  it('should return the empty string in file names starting with dots', function () {
    expect(util.getExtension('.htaccess')).toEqual('');
  });

  it('should return the empty string if file name is an empty string too', function () {
    expect(util.getExtension('')).toEqual('');
  });

  it('should add a final slash to the string parameter if missing', function () {
    expect(util.addSlashIfMissing('origin')).toEqual('origin/');
    expect(util.addSlashIfMissing('origin/')).toEqual('origin/');
  });

  it('should return an empty string if directory name is falsy', function () {
    expect(util.addSlashIfMissing('')).toEqual('');
  });

});
