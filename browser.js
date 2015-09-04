/**
 * Module dependencies.
 */
var debug = require('debug')('glint:ckeditor');
var merge = require('utils-merge');
var load = require('load-script');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

/**
 * Expose CKEditorBlock element.
 */
exports = module.exports = CKEditorBlock;
inherits(CKEditorBlock, EventEmitter);

/**
 * Initialize a new `CKEditorBlock` element.
 * @param {Object} options object
 */

function CKEditorBlock(options) {
  if (!(this instanceof CKEditorBlock)) return new CKEditorBlock(options);
  merge(this, options);
}

/**
 * API functions.
 */
CKEditorBlock.prototype.api = CKEditorBlock.api = 'block-provider';

CKEditorBlock.prototype.load = function(content) {
  this.el.removeAttribute('contenteditable');
  if (!content) return;
  this.content = content;
  this.setContent(this.content);
  return this.content;
};

CKEditorBlock.prototype.edit = function() {
  var self = this;
  if (this.ckeditor && (this.ckeditor.checkDirty() || this.ckeditor.status !== 'ready')) {
    // only called once
    self.el.setAttribute('contenteditable', true);
    self.ckeditor = CKEDITOR.inline(self.el, self.config);
    return;
  }

  if (this.ckeditor) return;

  this.initialize();
  this.once('initialized', function(e) {
    self.el.setAttribute('contenteditable', true);
    self.ckeditor = CKEDITOR.inline(self.el, self.config);

    CKEDITOR.on('dialogDefinition', function(e) {
      var dialogName = e.data.name;
      var dialog = e.data.definition.dialog;
      debug('dialogDefinition', dialogName, dialog);
      dialog.on('show', function() {
        var el;
        if (dialogName == 'image2') {
          el = this.getContentElement("info", "src");
          if (el) el.disable();
        }
        if (dialogName == 'base64imageDialog') {
          el = this.getContentElement("tab-source", "url");
          if (el) el.disable();
        }

        debug('dialog ' + dialogName + ' opened. The width is ' + this.getSize().width + 'px.');
      });
      dialog.on('hide', function() {
        debug('dialog ' + dialogName + ' closed.');
      });
    });


  })
};

CKEditorBlock.prototype.save = function() {
  this.el.removeAttribute('contenteditable');
  if (this.ckeditor) {
    this.content = this.ckeditor.getData();
  } else {
    this.content = this.getContent();
  }
  this.close();

  return this.content;
};

/**
 * Base functions.
 */

CKEditorBlock.prototype.defaults = function() {
  this.path = this.path || '/assets/glint-block-ckeditor/ckeditor.js';
  this.config = this.config || {
    //extraPlugins: 'devtools',
    'language': 'en',

    // http://docs.ckeditor.com/#!/guide/dev_file_browse_upload
    filebrowserBrowseUrl: '/filemanager' + location.pathname,
    filebrowserUploadUrl: '/ckeditor-upload' + location.pathname,
    filebrowserImageBrowseUrl: '/filemanager' + location.pathname,
    filebrowserImageUploadUrl: '/ckeditor-upload' + location.pathname,
    filebrowserImageBrowseLinkUrl: '/filemanager' + location.pathname,

    filebrowserImageWindowWidth: '640',
    filebrowserImageWindowHeight: '480'

  };
};

CKEditorBlock.prototype.initialize = function() {
  var self = this;
  if (this.initialized || ('undefined' == typeof window)) return;
  this.defaults();

  window.CKEDITOR_BASEPATH = getPath(this.path);
  debug('CKEDITOR_BASEPATH:', window.CKEDITOR_BASEPATH, ' name:', getName(this.path));

  load(this.path, function(err) {
    if (err) {
      debug("could not load CKEDITOR", self.path, err.stack);
    } else {
      // use script
      // note that in IE8 and below loading error wouldn't be reported
      debug('ckeditor scriptloaded');
      CKEDITOR.on('instanceReady', function(e) {
        debug('ckeditor instanceReady', e);
      });
      CKEDITOR.on('loaded', function(e) {
        debug('ckeditor loaded', e);
      });
      // set to true, otherwise all elements with contenteditable="true" will be turned into CKEDITOR instances
      window.CKEDITOR.disableAutoInline = true;
      self.initialized = true;
      self.emit('initialized');
    }
  })
};

CKEditorBlock.prototype.close = function() {
  try {
    this.el.removeAttribute('contenteditable');
    if (this.ckeditor && typeof this.ckeditor.destroy == 'function') this.ckeditor.destroy(true);
    //this.ckeditor = null;
  } catch (e) {
   debug('close (destroy) error', e);
  }
}

CKEditorBlock.prototype.getContent = function() {
  return this.el.innerHTML;
};

CKEditorBlock.prototype.setContent = function(content) {
  this.el.innerHTML = content;
};

function getPath(str) {
  var n = str.lastIndexOf('/');
  if (n < 0) return '';
  return str.substring(0, n + 1);
}

function getName(str) {
  var n = str.lastIndexOf('/');
  if (n < 0) return str;
  return str.substring(n + 1);
}
