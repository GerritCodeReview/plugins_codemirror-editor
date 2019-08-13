// Copyright (C) 2017 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
(function() {
  Polymer({
    is: 'codemirror-element',
    /**
     * Fired when the content of the editor changes.
     *
     * @event content-change
     */

    ready() {
      this.scopeSubtree(this.$.wrapper, true);
    },

    attached() {
      this._initialize();
    },

    setParams(params) {
      this._params = params;
      this._initialize();
    },

    _initialize() {
      // setParams(params) can be called before or after attach().
      // Codemirror must be initialized only after both functions were called
      if(!this._params || !this.isAttached) {
        return;
      }
      // attached() can be called multiple times.
      // Initialization must be done only once
      if(this.initialized) {
        return;
      }
      this.initialized = true;
      this.scopeSubtree(this.$.wrapper, true);
      this._nativeMirror = window.CodeMirror(this.$.wrapper, this._params);
      this.async(() => {
        this._nativeMirror.refresh();
        this._nativeMirror.focus();
      }, 1);
      this._addEventListeners();
    },

    _addEventListeners() {
      this._nativeMirror.on('change', e => {
        this.dispatchEvent(new CustomEvent('content-change',
            {detail: {value: e.getValue()}}));
      });
    },

  });
})();
