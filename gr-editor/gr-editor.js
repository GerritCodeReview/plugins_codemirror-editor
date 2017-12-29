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

  const LANGUAGE_MAP = {
    /*'application/dart': 'dart',
    'application/json': 'json',
    'application/typescript': 'typescript',
    'application/x-erb': 'erb',
    'text/css': 'css',
    'text/html': 'html',
    'text/javascript': 'javascript',
    'text/x-c': 'cpp',
    'text/x-c++src': 'cpp',
    'text/x-clojure': 'clojure',
    'text/x-common-lisp': 'lisp',
    'text/x-csharp': 'csharp',
    'text/x-csrc': 'cpp',
    'text/x-d': 'd',
    'text/x-go': 'go',
    'text/x-haskell': 'haskell',
    'text/x-java': 'java',
    'text/x-kotlin': 'kotlin',
    'text/x-lua': 'lua',
    'text/x-markdown': 'markdown',
    'text/x-objectivec': 'objectivec',
    'text/x-ocaml': 'ocaml',
    'text/x-perl': 'perl',*/
    'text/x-php': 'php',
    /*'text/x-protobuf': 'protobuf',
    'text/x-puppet': 'puppet',
    'text/x-python': 'python',
    'text/x-ruby': 'ruby',
    'text/x-rustsrc': 'rust',
    'text/x-scala': 'scala',
    'text/x-shell': 'shell',
    'text/x-sh': 'bash',
    'text/x-sql': 'sql',
    'text/x-swift': 'swift',
    'text/x-yaml': 'yaml',*/
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
      const prefs = this.getPreferences(this.prefs);
      this.mirror = CodeMirror(this.$.wrapper, prefs);
      this.async(() => { this.mirror.refresh(); }, 1);
      this.addEventListeners();
    },

    addEventListeners() {
      this.mirror.on('change', e => {
        this.dispatchEvent(new CustomEvent('content-change',
            {detail: {value: e.getValue()}, bubbles: true}));
      });
    },

    getPreferences(prefs) {
      const content = this.fileContent ? this.fileContent : '';

      let pref = {
        value: content,
      };

      if (prefs) {
        pref.autoCloseBrackets = prefs.auto_close_brackets;
        pref.cursorBlinkRate = prefs.cursor_blink_rate;
        pref.cursorHeight = 0.85;
        pref.indentUnit = prefs.indent_unit;
        pref.keyMap = prefs.key_map_type.toLowerCase();
        pref.lineNumbers = prefs.hide_line_numbers;
        pref.lineWrapping = prefs.line_wrapping;
        pref.indentWithTabs = prefs.indent_with_tabs;
        pref.matchBrackets = prefs.match_brackets;
        if (prefs.syntax_highlighting) {
          pref.mode = this.languageMap();
        } else {
          pref.mode = '';
        }
        pref.origLeft = content;
        pref.scrollbarStyle = 'overlay';
        pref.showTrailingSpace = prefs.show_whitespace_errors;
        pref.styleSelectedText = true;
        pref.tabSize = prefs.tab_size;
        pref.theme = prefs.theme.toLowerCase();

        if (this.fileContent && this.fileContent.includes('\r\n')) {
          pref.lineSeparator = '\r\n';
        }
      }

      return pref;
    },

    languageMap() {
      if (this.fileType && CodeMirror.findModeByMIME(this.fileType)) {
        return CodeMirror.findModeByMIME(this.fileType).mode;
      } else if (this.fileType && LANGUAGE_MAP[this.fileType]) {
        return LANGUAGE_MAP[this.fileType];
      } else {
        // Return empty string to prevent it from erroring out.
        return '';
      }
    },
  });
})();
