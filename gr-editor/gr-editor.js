/**
 * @license
 * Copyright (C) 2017 The Android Open Source Project
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

import 'codemirror-minified/lib/codemirror.js';
import 'codemirror-minified/addon/display/rulers.js';
import 'codemirror-minified/addon/edit/closebrackets.js';
import 'codemirror-minified/addon/edit/closetag.js';
import 'codemirror-minified/addon/edit/matchbrackets.js';
import 'codemirror-minified/addon/edit/matchtags.js';
import 'codemirror-minified/addon/edit/trailingspace.js';
import 'codemirror-minified/addon/mode/simple.js';
import 'codemirror-minified/addon/mode/multiplex.js';
import 'codemirror-minified/mode/meta.js';
import 'codemirror-minified/mode/clike/clike.js';
import 'codemirror-minified/mode/clojure/clojure.js';
import 'codemirror-minified/mode/coffeescript/coffeescript.js';
import 'codemirror-minified/mode/commonlisp/commonlisp.js';
import 'codemirror-minified/mode/css/css.js';
import 'codemirror-minified/mode/d/d.js';
import 'codemirror-minified/mode/dart/dart.js';
import 'codemirror-minified/mode/diff/diff.js';
import 'codemirror-minified/mode/django/django.js';
import 'codemirror-minified/mode/dockerfile/dockerfile.js';
import 'codemirror-minified/mode/erlang/erlang.js';
import 'codemirror-minified/mode/go/go.js';
import 'codemirror-minified/mode/groovy/groovy.js';
import 'codemirror-minified/mode/haml/haml.js';
import 'codemirror-minified/mode/handlebars/handlebars.js';
import 'codemirror-minified/mode/haskell/haskell.js';
import 'codemirror-minified/mode/htmlembedded/htmlembedded.js';
import 'codemirror-minified/mode/htmlmixed/htmlmixed.js';
import 'codemirror-minified/mode/javascript/javascript.js';
import 'codemirror-minified/mode/jinja2/jinja2.js';
import 'codemirror-minified/mode/jsx/jsx.js';
import 'codemirror-minified/mode/julia/julia.js';
import 'codemirror-minified/mode/lua/lua.js';
import 'codemirror-minified/mode/markdown/markdown.js';
import 'codemirror-minified/mode/mllike/mllike.js';
import 'codemirror-minified/mode/nginx/nginx.js';
import 'codemirror-minified/mode/perl/perl.js';
import 'codemirror-minified/mode/php/php.js';
import 'codemirror-minified/mode/powershell/powershell.js';
import 'codemirror-minified/mode/properties/properties.js';
import 'codemirror-minified/mode/protobuf/protobuf.js';
import 'codemirror-minified/mode/puppet/puppet.js';
import 'codemirror-minified/mode/python/python.js';
import 'codemirror-minified/mode/rpm/rpm.js';
import 'codemirror-minified/mode/ruby/ruby.js';
import 'codemirror-minified/mode/sass/sass.js';
import 'codemirror-minified/mode/scheme/scheme.js';
import 'codemirror-minified/mode/shell/shell.js';
import 'codemirror-minified/mode/soy/soy.js';
import 'codemirror-minified/mode/sparql/sparql.js';
import 'codemirror-minified/mode/sql/sql.js';
import 'codemirror-minified/mode/swift/swift.js';
import 'codemirror-minified/mode/tcl/tcl.js';
import 'codemirror-minified/mode/velocity/velocity.js';
import 'codemirror-minified/mode/verilog/verilog.js';
import 'codemirror-minified/mode/vb/vb.js';
import 'codemirror-minified/mode/xml/xml.js';
import 'codemirror-minified/mode/yaml/yaml.js';

import './codemirror-element.js';

class GrEditor extends Polymer.Element {
  /**
   * Fired when the content of the editor changes.
   *
   * @event content-change
   */

  /** @returns {string} name of the component */
  static get is() {
    return 'gr-editor';
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
      <codemirror-element
        id="codemirror"
        line-num="[[lineNum]]">
      </codemirror-element>
    `;
  }

  /** Hook on connectedCallback */
  connectedCallback() {
    super.connectedCallback();
    this._initializeMirror();
  }

  /** @returns {!Promise} Initialize code mirror editor */
  _initializeMirror() {
    const params = this.getCodeMirrorParams(
        this.fileType,
        this.fileContent,
        this.prefs
    );
    this.mirror = this.$.codemirror;
    this.mirror.setParams(params);
    this._addEventListeners();
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

    params.scrollbarStyle = 'overlay';

    if (prefs) {
      // TODO: Add gerrit's customizations from java codemirror to javascript
      // gerrit-gwtui/src/main/java/net/codemirror/lib/Extras.java
      params.autoCloseBrackets = prefs.auto_close_brackets;
      params.cursorHeight = 0.85;
      params.indentUnit = prefs.indent_unit;
      params.indentWithTabs = prefs.indent_with_tabs;
      // TODO(kaspern): Add support for keymaps.
      // params.keyMap = prefs.key_map_type.toLowerCase();
      params.lineNumbers = true;
      params.lineWrapping = prefs.line_wrapping;
      params.matchBrackets = prefs.match_brackets;
      // TODO: Add support for a new commit msg MIME type
      // Support for this is somewhere in gerrit's codebase
      // needs backporting to javascript
      params.mode = prefs.syntax_highlighting ? type || '' : '';
      params.showTabs = prefs.show_tabs;
      params.showTrailingSpace = prefs.show_whitespace_errors;
      params.tabSize = prefs.tab_size;
      // TODO(kaspern): Add support for themes.
      // params.theme = prefs.theme.toLowerCase();

      params.rulers = [{column: prefs.line_length}];
      if (value && value.includes('\r\n')) {
        params.lineSeparator = '\r\n';
      }
    }

    return params;
  }
}

customElements.define(GrEditor.is, GrEditor);

if (window.Gerrit) {
  Gerrit.install(plugin => {
    plugin.registerCustomComponent('editor', 'gr-editor', {replace: true});
  });
}
