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

  // we need to be on codemirror 5.33.0+ to get the support for
  // text/x-php in CodeMirror.findModeByMIME
  const LANGUAGE_MAP = {
    'text/x-php': 'php',
  };

  Polymer({
    is: 'gr-editor',
    /**
     * Fired when the content of the editor changes.
     *
     * @event content-change
     */

    properties: {
      fileContent: String,
      fileType: String,
      mirror: Object,
      prefs: Object,
    },

    attached() {
      this.scopeSubtree(this.$.wrapper, true);
      const params =
          this.getCodeMirrorParams(this.fileType, this.fileContent, this.prefs);
      this.mirror = CodeMirror(this.$.wrapper, params);
      this.async(() => { this.mirror.refresh(); }, 1);
      this.addEventListeners();
    },

    addEventListeners() {
      this.mirror.on('change', e => {
        this.dispatchEvent(new CustomEvent('content-change',
            {detail: {value: e.getValue()}, bubbles: true}));
      });
    },

    getCodeMirrorParams(type, value, prefs) {
      const params = {value};

      if (prefs) {
        // TODO: Add gerrit's customizations from java codemirror to javascript
        // gerrit-gwtui/src/main/java/net/codemirror/lib/Extras.java
        params.autoCloseBrackets = prefs.auto_close_brackets;
        params.cursorBlinkRate = prefs.cursor_blink_rate;
        params.cursorHeight = 0.85;
        params.hideTopMenu = prefs.hide_top_menu;
        params.indentUnit = prefs.indent_unit;
        params.indentWithTabs = prefs.indent_with_tabs;
        // TODO(kaspern): Add support for keymaps.
        // params.keyMap = prefs.key_map_type.toLowerCase();
        params.lineLength = prefs.line_length;
        params.lineNumbers = prefs.hide_line_numbers;
        params.lineWrapping = prefs.line_wrapping;
        params.indentWithTabs = prefs.indent_with_tabs;
        params.matchBrackets = prefs.match_brackets;
        // TODO: Add support for a new commit msg MIME type
        // Support for this is somewhere in gerrit's codebase
        // needs backporting to javascript
        params.mode = prefs.syntax_highlighting ? this._mapFileType(type) : '';
        params.origLeft = value;
        params.showTabs = prefs.show_tabs;
        params.showTrailingSpace = prefs.show_whitespace_errors;
        params.styleSelectedText = true;
        params.tabSize = prefs.tab_size;
        // TODO(kaspern): Add support for themes.
        params.theme = prefs.theme.toLowerCase();

        if (value && value.includes('\r\n')) {
          params.lineSeparator = '\r\n';
        }
      }

      return params;
    },

    _mapFileType(type) {
      return LANGUAGE_MAP[type] || type || '';
    },
  });
})();
