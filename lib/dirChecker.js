'use strict';

var fs = require('fs');
var addSlashIfMissing = require('./utility').addSlashIfMissing;

function DirChecker(dir) {
  this.dir = addSlashIfMissing(dir);
}

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

DirChecker.prototype.getDirs = function (dir) {
  dir = dir || this.dir;
  dir = addSlashIfMissing(dir);
  return fs.readdirSync(dir).filter(function (file) {
    return fs.statSync(dir + file).isDirectory();
  });
};

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
