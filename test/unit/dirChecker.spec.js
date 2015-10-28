describe('Directory checker', function () {
  'use strict';

  var DirChecker = require('../../lib/dirChecker');
  var dirChecker;

  it('should return true if directory does not contains any sub-directory', function () {
    dirChecker = new DirChecker(__dirname + '/fixtures/');
    expect(dirChecker.containsDir(__dirname + '/fixtures')).toBe(false);
  });

  it('should return false if directory contains any sub-directory', function () {
    dirChecker = new DirChecker(__dirname);
    expect(dirChecker.containsDir()).toBe(true);
  });

  it('should return the list of directories', function () {
    dirChecker = new DirChecker(__dirname);
    expect(dirChecker.getDirs()).toEqual(['fixtures']);
  });

  it('should return an empty array if directory does not contains any sub-directory', function () {
    dirChecker = new DirChecker(__dirname);
    expect(dirChecker.getDirs()).toEqual(['fixtures']);
  });

  it('should return the count of valid directories', function () {
    dirChecker = new DirChecker(__dirname.replace('unit', 'recursive'));
    expect(dirChecker.countFileSubDirsRecursive()).toEqual(6);
  });

});
