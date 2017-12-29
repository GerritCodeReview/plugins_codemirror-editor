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
  'use strict';

  Polymer({
    is: 'gr-editor',
    /**
     * Fired when the content of the editor changes.
     *
     * @event content-change
     */

    properties: {
      fileContent: String,
      mirror: Object,
      prefs: Object,
    },

    attached() {
      this.scopeSubtree(this.$.wrapper, true);
      const content = this.fileContent ? this.fileContent : '';
      this.mirror = CodeMirror(this.$.wrapper, Object.assign({} , {
        value: content,
      }, this.prefs));
      this.async(() => { this.mirror.refresh(); }, 1);
      this.addEventListeners();
    },

    addEventListeners() {
      this.mirror.on('change', e => {
        this.dispatchEvent(new CustomEvent('content-change',
            {detail: {value: e.getValue()}, bubbles: true}));
      });
    },
  });
})();