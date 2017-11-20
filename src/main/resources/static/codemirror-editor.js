(function() {
  'use strict';

  Polymer({
    is: 'codemirror-editor',
    properties: {
      fileContent: String,
      mirror: Object,
      prefs: Object,
      path: String,
    },

    attached() {
      var prefs = this.prefs;
      var mode = CodeMirror.findModeByFileName(this.path) ?
          CodeMirror.findModeByFileName(this.path).mode : '';
      var content = this.fileContent ? this.fileContent : '';
      this.mirror = CodeMirror(this.$.wrapper, {
        value: content,
        mode: mode,
        prefs,
      });
      this.async(() => { this.mirror.refresh(); }, 1);
      this.addEventListeners();
    },

    addEventListeners() {
      this.mirror.on('change', e => {
        this.dispatchEvent(new CustomEvent('change',
            {detail: {value: e.getValue()}, bubbles: true}));
      });
    },
  });
})();
