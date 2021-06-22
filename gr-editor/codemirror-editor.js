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

import {EditorView, /*keymap,*/ highlightSpecialChars, /*drawSelection,*/ highlightActiveLine} from "@codemirror/view"
import {Extension, EditorState} from "@codemirror/state"
import {lineNumbers, highlightActiveLineGutter} from "@codemirror/gutter"
// import {defaultKeymap} from "@codemirror/commands"
import {bracketMatching} from "@codemirror/matchbrackets"
import {closeBrackets, closeBracketsKeymap} from "@codemirror/closebrackets"
// import {rectangularSelection} from "@codemirror/rectangular-selection"
import {defaultHighlightStyle} from "@codemirror/highlight"
import {StreamLanguage} from "@codemirror/stream-parser"
import {indentOnInput, indentUnit, LanguageDescription} from "@codemirror/language"
import {languages} from "@codemirror/language-data";
/*import {css, less, sCSS} from "@codemirror/legacy-modes/mode/css"
import {dart} from "@codemirror/legacy-modes/mode/dart"
import {javascript, json, typescript} from "@codemirror/legacy-modes/mode/javascript"
import {lua} from "@codemirror/legacy-modes/mode/lua"
import {html, xml} from "@codemirror/legacy-modes/mode/xml"
import {powershell} from "@codemirror/legacy-modes/mode/powershell"*/

/*const LANGUAGE = [
  ['application/dart', dart],
  ['application/json', json],
  ['application/x-powershell', powershell],
  ['application/typescript', typescript],
  ['application/xml', xml],
  ['application/xquery', xquery],
  ['application/x-erb', erb],
  ['text/css', css],
  ['text/html', html],
  ['text/javascript', javascript],
  ['text/jsx', jsx],
  ['text/tsx', jsx],
  ['text/x-c', cpp],
  ['text/x-c++src', cpp],
  ['text/x-clojure', clojure],
  ['text/x-cmake', cmake],
  ['text/x-coffeescript', coffeescript],
  ['text/x-common-lisp', lisp],
  ['text/x-crystal', crystal],
  ['text/x-csharp', csharp],
  ['text/x-csrc', cpp],
  ['text/x-d', d],
  ['text/x-diff', diff],
  ['text/x-django', django],
  ['text/x-dockerfile', dockerfile],
  ['text/x-ebnf', ebnf],
  ['text/x-elm', elm],
  ['text/x-erlang', erlang],
  ['text/x-fortran', fortran],
  ['text/x-fsharp', fsharp],
  ['text/x-go', go],
  ['text/x-groovy', groovy],
  ['text/x-haml', haml],
  ['text/x-handlebars', handlebars],
  ['text/x-haskell', haskell],
  ['text/x-haxe', haxe],
  ['text/x-ini', ini],
  ['text/x-java', java],
  ['text/x-julia', julia],
  ['text/x-kotlin', kotlin],
  ['text/x-latex', latex],
  ['text/x-less', less],
  ['text/x-lua', lua],
  ['text/x-mathematica', mathematica],
  ['text/x-nginx-conf', nginx],
  ['text/x-nsis', nsis],
  ['text/x-objectivec', objectivec],
  ['text/x-ocaml', ocaml],
  ['text/x-perl', perl],
  ['text/x-pgsql', pgsql], // postgresql
  ['text/x-php', php],
  ['text/x-properties', properties],
  ['text/x-protobuf', protobuf],
  ['text/x-puppet', puppet],
  ['text/x-python', python],
  ['text/x-q', q],
  ['text/x-ruby', ruby],
  ['text/x-rustsrc', rust],
  ['text/x-scala', scala],
  ['text/x-scss', sCSS],
  ['text/x-scheme', scheme],
  ['text/x-shell', shell],
  ['text/x-soy', soy],
  ['text/x-spreadsheet', excel],
  ['text/x-sh', bash],
  ['text/x-sql', sql],
  ['text/x-swift', swift],
  ['text/x-systemverilog', sv],
  ['text/x-tcl', tcl],
  ['text/x-torque', torque],
  ['text/x-twig', twig],
  ['text/x-vb', vb],
  ['text/x-verilog', v],
  ['text/x-vhdl', vhdl],
  ['text/x-yaml', yaml],
  ['text/vbscript', vbscript],
];*/

const LANGUAGE = [
  ['application/dart', 'dart'],
  ['application/json', 'json'],
  ['application/x-powershell', 'powershell'],
  ['application/typescript', 'typescript'],
  ['application/xml', 'xml'],
  ['application/xquery', 'xquery'],
  ['application/x-erb', 'erb'],
  ['text/css', 'css'],
  ['text/html', 'html'],
  ['text/javascript', 'js'],
  ['text/jsx', 'jsx'],
  ['text/tsx', 'jsx'],
  ['text/x-c', 'cpp'],
  ['text/x-c++src', 'cpp'],
  ['text/x-clojure', 'clojure'],
  ['text/x-cmake', 'cmake'],
  ['text/x-coffeescript', 'coffeescript'],
  ['text/x-common-lisp', 'lisp'],
  ['text/x-crystal', 'crystal'],
  ['text/x-csharp', 'csharp'],
  ['text/x-csrc', 'cpp'],
  ['text/x-d', 'd'],
  ['text/x-diff', 'diff'],
  ['text/x-django', 'django'],
  ['text/x-dockerfile', 'dockerfile'],
  ['text/x-ebnf', 'ebnf'],
  ['text/x-elm', 'elm'],
  ['text/x-erlang', 'erlang'],
  ['text/x-fortran', 'fortran'],
  ['text/x-fsharp', 'fsharp'],
  ['text/x-go', 'go'],
  ['text/x-groovy', 'groovy'],
  ['text/x-haml', 'haml'],
  ['text/x-handlebars', 'handlebars'],
  ['text/x-haskell', 'haskell'],
  ['text/x-haxe', 'haxe'],
  ['text/x-ini', 'ini'],
  ['text/x-java', 'java'],
  ['text/x-julia', 'julia'],
  ['text/x-kotlin', 'kotlin'],
  ['text/x-latex', 'latex'],
  ['text/x-less', 'less'],
  ['text/x-lua', 'lua'],
  ['text/x-mathematica', 'mathematica'],
  ['text/x-nginx-conf', 'nginx'],
  ['text/x-nsis', 'nsis'],
  ['text/x-objectivec', 'objectivec'],
  ['text/x-ocaml', 'ocaml'],
  ['text/x-perl', 'perl'],
  ['text/x-pgsql', 'pgsql'], // postgresql
  // ['text/x-php', 'php'],
  ['text/x-properties', 'properties'],
  ['text/x-protobuf', 'protobuf'],
  ['text/x-puppet', 'puppet'],
  ['text/x-python', 'python'],
  ['text/x-q', 'q'],
  ['text/x-ruby', 'ruby'],
  ['text/x-rustsrc', 'rust'],
  ['text/x-scala', 'scala'],
  ['text/x-scss', 'scss'],
  ['text/x-scheme', 'scheme'],
  ['text/x-shell', 'shell'],
  // ['text/x-soy', 'soy'],
  ['text/x-spreadsheet', 'excel'],
  ['text/x-sh', 'bash'],
  ['text/x-sql', 'sql'],
  ['text/x-swift', 'swift'],
  ['text/x-systemverilog', 'sv'],
  ['text/x-tcl', 'tcl'],
  ['text/x-torque', 'torque'],
  ['text/x-twig', 'twig'],
  ['text/x-vb', 'vb'],
  ['text/x-verilog', 'v'],
  ['text/x-vhdl', 'vhdl'],
  ['text/x-yaml', 'yaml'],
  ['text/vbscript', 'vbscript'],
];

const LANGUAGE_MAP = new Map(LANGUAGE);

class CodeMirrorEditor extends Polymer.GestureEventListeners(
    Polymer.LegacyElementMixin(
        Polymer.Element)) {
  /**
   * Fired when the content of the editor changes.
   *
   * @event content-change
   */

  /** @returns {string} name of the component */
  static get is() { return 'codemirror-editor'; }

  static get properties() {
    return {
      lineNum: Number,
    };
  }

  ready() {
    super.ready();
    this.scopeSubtree(this.$.wrapper, true);
  }

  attached() {
    super.attached();
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
    const extensions = this._getExtensions(this._params);
    this._nativeMirror = new EditorView({
      state: EditorState.create({
        doc: this._params.value,
        extensions
      }),
      parent: this.$.wrapper
    });
    this.async(() => {
      //this._nativeMirror.refresh();
      this._nativeMirror.focus();
      if (this.lineNum) {
        // We have to take away one from the line number,
        // ... because CodeMirror's line count is zero-based.
        // this._nativeMirror.setCursor(this.lineNum - 1);
      }
    }, 1);
    this._addEventListeners();
  }

  _getExtensions(params) {
    const value = [
      defaultHighlightStyle.fallback,
      lineNumbers(),
      highlightActiveLineGutter(),
      indentOnInput(),
    ];

    if (params.lineWrapping) {
      value.push(EditorView.lineWrapping);
    }

    if (params.matchBrackets) {
      value.push(bracketMatching());
    }

    if (params.autoCloseBrackets) {
      value.push(closeBrackets());
    }

    if (params.indentUnit) {
      value.push(indentUnit.of(params.indentUnit));
    }

    if (params.mode) {
      value.push(highlightSpecialChars());
      const lang = LANGUAGE_MAP.get(params.mode);
      const langMatch = LanguageDescription.matchLanguageName(languages, lang);
      if (lang && langMatch) {
        value.push(langMatch);
        //value.push(StreamLanguage.define(lang));
        value.push(defaultHighlightStyle);
      }
    }

    if (params.tabSize) {
      value.push(EditorState.tabSize.of(params.tabSize));
      // value.push(tabSize.of(EditorState.tabSize.of(params.tabSize)));
    }

    if (params.lineSeparator) {
      value.push(EditorState.lineSeparator.of('\r\n'));
    }

    value.push(highlightActiveLine());
    // value.push(highlightSelectionMatches());
    /*value.push(keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
    ]));*/

    return value;
  }

  /*getCodeMirrorParams(type, value, prefs) {
    const params = {value};

    if (prefs) {
      params.cursorHeight = 0.85;
      params.indentUnit = prefs.indent_unit;
      params.indentWithTabs = prefs.indent_with_tabs;
      params.lineNumbers = true;
      params.lineWrapping = prefs.line_wrapping;
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
  }*/

  _addEventListeners() {
    this._nativeMirror.on('change', e => {
      this.dispatchEvent(
          new CustomEvent('content-change', {detail: {value: e.getValue()}})
      );
    });
  }
}

customElements.define(CodeMirrorEditor.is, CodeMirrorEditor);
