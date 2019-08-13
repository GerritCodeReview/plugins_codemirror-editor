(function() {
  Polymer({
    is: 'codemirror-element',
    /**
     * Fired when the content of the editor changes.
     *
     * @event content-change
     */

    initialize(params) {
      this.scopeSubtree(this.$.wrapper, true);
      this._nativeMirror = window.CodeMirror(this.$.wrapper, params);
      this.async(() => {
        this._nativeMirror.refresh();
        this._nativeMirror.focus();
      }, 1);
      this._addEventListeners();
    },

    _addEventListeners() {
      this._nativeMirror.on('change', e => {
        this.dispatchEvent(new CustomEvent('change',
            {detail: {value: e.getValue()}}));
      });
    },

  });
})();
