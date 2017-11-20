(function() {
  'use strict';

  Polymer({
    is: 'codemirror-editor',
    properties: {
      fileContent: String,
      mirror: Object,
      prefs: Object,
    },

    attached() {
      var prefs = this.prefs;
      this.mirror = CodeMirror(this.$.wrapper, {
        value: this.fileContent,
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
