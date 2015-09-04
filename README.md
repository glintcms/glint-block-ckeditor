# glint-block-ckeditor


CKEditor Block


# install

```bash
npm install glint-block-ckeditor
```

the ckeditor itself is not installed with this package.
you have to install it your self.

### steps

 - download the stable release from github: https://github.com/ckeditor/ckeditor-dev/tree/stable or npm install ckeditor-dev
 - extend it (if needed) and build it with the provided build script:
   https://github.com/ckeditor/ckeditor-dev/tree/stable#building-a-release
 - or download it with the ckeditor builder: http://ckeditor.com/builder

 ### included ckeditor build
 standard build
  + Developer Tools
  + Justify
  + Minimalist theme
  + English, French, German, Italian, Spanish


# use

> This Module is part of [glintcms](http://glintcms.com/).
> Please see the [documentation](https://github.com/glintcms/glintcms) for more info.


### options

```js
ckeditor.path = '/js/ckeditor/ckeditor.js'
```

### events

```js
ckeditor.on('initialized', function() {
  console.log('initialized');
});
```


# test

```bash
npm test
```

# license

MIT

> sponsored by [intesso](http://intesso.com)
