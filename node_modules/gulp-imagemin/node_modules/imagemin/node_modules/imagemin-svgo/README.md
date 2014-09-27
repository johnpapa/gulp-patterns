# imagemin-svgo [![Build Status](https://travis-ci.org/imagemin/imagemin-svgo.svg?branch=master)](https://travis-ci.org/imagemin/imagemin-svgo)

> svgo image-min plugin


## Install

```sh
$ npm install --save imagemin-svgo
```


## Usage

```js
var Imagemin = require('image-min');
var svgo = require('imagemin-svgo');

var imagemin = new Imagemin()
    .src('foo.svg')
    .dest('foo-optimized.svg')
    .use(svgo());

imagemin.optimize();
```


## Options

### plugins

Type: `Array`  
Default: `[]`

Customize which SVGO [plugins](https://github.com/svg/svgo/tree/master/plugins) to use.

```js
var imagemin = new Imagemin()
    .use(svgo({ plugins: [{ removeViewBox: false, removeEmptyAttrs: false }] }));
```


## License

MIT © [imagemin](https://github.com/imagemin)
