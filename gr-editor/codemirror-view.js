/**
 * @license
 * Copyright (C) 2021 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './codemirror-editor.js';

class CodeMirrorView extends Polymer.Element {
  /**
   * Fired when the content of the editor changes.
   *
   * @event content-change
   */

  /** @returns {string} name of the component */
  static get is() {
    return 'codemirror-view';
  }

  /**
   * Defines properties of the component
   *
   * @returns {?}
   */
  static get properties() {
    return {
      fileContent: String,
      fileType: String,
      lineNum: Number,
      mirror: Object,
      prefs: Object,
      plugin: Object,
    };
  }

  /** @returns {?} template for this component */
  static get template() {
    return Polymer.html`
      <codemirror-editor
        id="codemirror"
        line-num="[[lineNum]]">
      </codemirror-editor>
    `;
  }

  /** Hook on connectedCallback */
  connectedCallback() {
    super.connectedCallback();
    this._initializeMirror();
  }

  /** @returns {!Promise} Initialize code mirror editor */
  _initializeMirror() {
    return new Promise((resolve, reject) => {
      const params = this.getCodeMirrorParams(
          this.fileType,
          this.fileContent,
          this.prefs
      );
      this.mirror = this.$.codemirror;
      this.mirror.setParams(params);
      this._addEventListeners();
      resolve();
    });
  }

  /** Set up content listeners */
  _addEventListeners() {
    this.mirror.addEventListener('content-change', e => {
      this.dispatchEvent(
          new CustomEvent('content-change', {
            detail: {value: e.detail.value},
            bubbles: true,
            composed: true,
          })
      );
    });
  }

  /**
   * Retrieve params for the editor
   *
   * @param {string} type
   * @param {string} value
   * @param {Object} prefs
   * @returns {Object}
   */
  getCodeMirrorParams(type, value, prefs) {
    const params = {value};

    if (prefs) {
      params.autoCloseBrackets = prefs.auto_close_brackets;
      params.cursorHeight = 0.85;
      params.indentUnit = prefs.indent_unit;
      params.indentWithTabs = prefs.indent_with_tabs;
      params.lineNumbers = true;
      params.lineWrapping = prefs.line_wrapping;
      params.matchBrackets = prefs.match_brackets;
      // TODO: Add support for a new commit msg MIME type
      // Support for this is somewhere in gerrit's codebase
      // needs backporting to javascript
      params.mode = prefs.syntax_highlighting && type ? type : '';
      params.showTabs = prefs.show_tabs;
      params.showTrailingSpace = prefs.show_whitespace_errors;
      params.tabSize = prefs.tab_size;

      params.rulers = [{column: prefs.line_length}];
      if (value && value.includes('\r\n')) {
        params.lineSeparator = '\r\n';
      }
    }

    return params;
  }
}

customElements.define(CodeMirrorView.is, CodeMirrorView);
