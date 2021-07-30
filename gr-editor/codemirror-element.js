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

import {htmlTemplate} from './codemirror-element_html.js';

class CodeMirrorElement extends Polymer.Element {

  /**
   * Fired when the content of the editor changes.
   *
   * @event content-change
   */

  /** @returns {string} name of the component */
  static get is() { return 'codemirror-element'; }

  static get template() {
    return htmlTemplate;
  }

  static get properties() {
    return {
      lineNum: Number,
    };
  }

  ready() {
    super.ready();
    this.scopeSubtree(this.$.wrapper, true);
  }

  connectedCallback() {
    super.connectedCallback();
    this._initialize();
  }

  setParams(params) {
    this._params = params;
    this._initialize();
  }

  _initialize() {
    // setParams(params) can be called before or after attached().
    // Codemirror must be initialized only after both functions were called
    if (!this._params || !this.isAttached) {
      return;
    }
    // attached() can be called multiple times.
    // Initialization must be done only once
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.scopeSubtree(this.$.wrapper, true);
    // eslint-disable-next-line new-cap
    this._nativeMirror = window.CodeMirror(this.$.wrapper, this._params);
    this.async(() => {
      this._nativeMirror.refresh();
      this._nativeMirror.focus();
      if (this.lineNum) {
        // We have to take away one from the line number,
        // ... because CodeMirror's line count is zero-based.
        this._nativeMirror.setCursor(this.lineNum - 1);
      }
    }, 1);
    this._addEventListeners();
  }

  _addEventListeners() {
    this._nativeMirror.on('change', e => {
      this.dispatchEvent(
          new CustomEvent('content-change', {detail: {value: e.getValue()}})
      );
    });
  }
}

customElements.define(CodeMirrorElement.is, CodeMirrorElement);
