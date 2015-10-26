# grunt-png-diff

> Test if PNG images in a directory are equal each other with a customizable percentage of acceptable mismatch.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-png-diff --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-png-diff');
```

## The "png_diff" task

### Overview
In your project's Gruntfile, add a section named `png_diff` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  png_diff: {
    your_target: {
      options: {
        // Custom options, see below
      },
      origin: 'path/to/origin/directory',
      destination: 'path/to/destionation/directory'
    },
  },
});
```

The `origin` is the folder that contains images to compare, the `destination` is the directory where comparison result
images will be saved. The `options` defines the configuration of the comparison.

### Options

#### options.reference
Type: `String`
Default value: `'reference.png'`

The file name of the PNG images used as a reference for each comparison.

#### options.tolerance
Type: `number`
Default value: `10`

The percentage value of acceptable mismatch. e.g. If tolerance is 10%, an image differs that differs from the reference
by 15% of total pixels, would fail the test.

#### options.antiAliasing
Type: `boolean`
Default value: `false`

If `true`, disables detecting and ignoring anti-aliased pixels.

#### options.threshold
Type: `number`
Default value: `0.1`

Matching threshold, ranges from `0` to `1`. Smaller values make the comparison more sensitive.

#### options.resize
Type: `boolean`
Default value: `false`

If `true` resizes all the images in the origin directory to the size of the smaller one, since the comparison would not
be reliable if images have different size (height and width in pixel). Bigger images are cropped from the top left
corner to the size of the smallest one.

### Usage Examples

#### Default options
This example shows a complete configuration for the plugin.

In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  png_diff: {
    your_target: {
      options: {
        reference: 'reference_image.png',
        antiAliasing: true,
        threshold: 0.05,
        tolerance: 20
    },
    origin: 'fixtures/orig',
    destination: 'fixture/dest'
  }
});

grunt.loadNpmTasks('grunt-png-diff');
grunt.registerTask('shots-compare', ['png_diff:your_target']);
```
## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
