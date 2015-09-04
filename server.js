module.exports = function CKEditorBlock () {
  return {
    load: function (content) {
      return content;
    },
    api: 'block-provider'
  }
};
