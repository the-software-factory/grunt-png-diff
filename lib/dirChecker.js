'use strict';

var fs = require('fs');
var addSlashIfMissing = require('./utility').addSlashIfMissing;

function DirChecker(dir) {
  this.dir = addSlashIfMissing(dir);
}

/**
 * Check if a directory has any subdirectory.
 * @param {string} dir The directory name.
 * @returns {boolean} true if the directory contains any sub-directory.
 */
DirChecker.prototype.containsDir = function (dir) {
  dir = dir || this.dir;
  dir = addSlashIfMissing(dir);
  var files = fs.readdirSync(dir);
  var containsDir = false;
  for (var i = 0; i < files.length && !containsDir; i++) {
    var fileStat = fs.statSync(dir + files[i]);
    containsDir = fileStat.isDirectory();
  }
  return containsDir;
};

/**
 * Given a directory name, returns the array of sub-directory names.
 * @param {string} dir The directory name.
 * @returns {Array} the array of sub-directory names.
 */
DirChecker.prototype.getDirs = function (dir) {
  dir = dir || this.dir;
  dir = addSlashIfMissing(dir);
  return fs.readdirSync(dir).filter(function (file) {
    return fs.statSync(dir + file).isDirectory();
  });
};

/**
 * Count the number of sub-directory which does not contains any sub-directory. Considering the directory structure as
 * a tree, this methods counts the leafs of that tree. This is the number of tests.
 * @param {string} dir the name of the root directory.
 * @param {DirChecker} self the object itself, it is useful only for the recursive calls.
 * @returns {number} the total number of leaf directory.
 */
DirChecker.prototype.countFileSubDirsRecursive = function (dir, self) {
  self = self || this;
  dir = dir || this.dir;
  dir = addSlashIfMissing(dir);
  var count = 0;
  var dirs = self.getDirs(dir);
  for (var i = 0; i < dirs.length; i++) {
    if (!self.containsDir(dir + dirs[i])) {
      count++;
    } else {
      count += self.countFileSubDirsRecursive(dir + dirs[i], self);
    }
  }
  return count;
};

module.exports = DirChecker;
