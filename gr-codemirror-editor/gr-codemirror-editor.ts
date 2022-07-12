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

import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators';

import {
  EditorView,
  ViewUpdate,
  ViewPlugin,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  lineNumbers,
  highlightActiveLineGutter,
} from '@codemirror/view';
import {EditorState, Annotation} from '@codemirror/state';
import {
  defaultHighlightStyle,
  indentOnInput,
  foldGutter,
  foldKeymap,
  bracketMatching,
  syntaxHighlighting,
  indentUnit,
} from '@codemirror/language';
import {defaultKeymap, history, historyKeymap, indentWithTab} from '@codemirror/commands';
import {searchKeymap, highlightSelectionMatches} from '@codemirror/search';
import {closeBrackets, closeBracketsKeymap} from '@codemirror/autocomplete';
//import {languages} from '@codemirror/language-data';
import {basicLightTheme} from 'cm6-theme-basic-light';

import {css as _css} from '@codemirror/lang-css';
import {cpp as _cpp} from '@codemirror/lang-cpp';
import {html as _html} from '@codemirror/lang-html';
import {java as _java} from '@codemirror/lang-java';
import {javascript as _javascript} from '@codemirror/lang-javascript';
import {json as _json} from '@codemirror/lang-json';
import {markdown as _markdown} from '@codemirror/lang-markdown';
import {php as _php} from '@codemirror/lang-php';
import {python as _python} from '@codemirror/lang-python';
import {rust as _rust} from '@codemirror/lang-rust';
import {sql as _sql} from '@codemirror/lang-sql';
import {xml as _xml} from '@codemirror/lang-xml';

const SetTextCalled = Annotation.define();
function eventPlugin(thisEl: LitElement) {
  return ViewPlugin.fromClass(
    class {
      update(update: ViewUpdate) {
        if (
          update.transactions.length > 0 &&
          update.transactions[0].annotation(SetTextCalled)
        ) {
          return;
        }

        if (!update.docChanged) return;

        let text = '';
        for (const subtext of update.state.doc.iter()) {
          text += subtext;
        }
        thisEl.dispatchEvent(
          new CustomEvent('content-change', {
            detail: {value: text},
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  );
}

@customElement('gr-codemirror-editor')
export class GrCodemirrorEditor extends LitElement {
  /**
   * Fired when the content of the editor changes.
   *
   * @event content-change
   */

  @property({type: String})
  set fileContent(t: string) {
    if (this.editor) {
      this.setText(t);
    } else {
      this._fileContent = t;
    }
  }

  _fileContent = '';

  @property({type: Number})
  lineNum?: number;

  @property({type: Object})
  prefs?: any;

  editor!: EditorView;

  @query('#editor')
  _editorEl!: HTMLElement;

  static override get styles() {
    return [
      css`
        #editor {
          height: 100%;
          z-index: 0;
        }
        .cm-editor {
          font-family: 'Roboto Mono', 'SF Mono', 'Lucida Console', Monaco, monospace;
          /* CodeMirror has a default z-index of 4. Set to 0 to avoid collisions with fixed header. */
          z-index: 0;
        }
        .CodeMirror-linenumbers {
          background-color: #fafafa;
        }
        .CodeMirror-linenumber {
          color: #757575;
        }
        .CodeMirror-ruler {
          border-left: 1px solid #ddd;
        }
        .cm-editor .cm-content {
          font-family: 'Roboto Mono', 'SF Mono', 'Lucida Console', Monaco, monospace;
        }
        .cm-tab:before {
          color: #757575;
          content: "\\2192";
          position: absolute;
        }
        .cm-trailingspace {
          background-color: #ef9a9a;
          border: 1px solid #f44336;
          border-radius: 3px;
        }
      `,
    ];
  }

  override render() {
    return html`<div id="editor"></div>`;
  }

  override firstUpdated() {
    //console.log(languages);
    this.editor = new EditorView({
      state: EditorState.create({
        doc: this._fileContent,
        extensions: [
          ...this.getCodeMirrorExtensions()
          /*lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          history(),
          foldGutter(),
          drawSelection(),
          EditorState.allowMultipleSelections.of(true),*/
          //indentOnInput(),
          //syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
          //bracketMatching(),
          //closeBrackets(),
          /*autocompletion(),
          highlightActiveLine(),
          highlightSelectionMatches(),
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
          ]),*/
          /*_css(),
          _cpp(),
          _html(),
          _java(),
          _javascript(),
          _json(),
          _markdown(),
          _php(),
          _python(),
          _rust(),
          _sql(),
          _xml(),*/
          //eventPlugin(this),
          //basicLightTheme,
        ],
      }),
      parent: this._editorEl as Element,
    });

    setTimeout(() => {
      this.editor.focus();

      if (this.lineNum) {
        // We have to take away one from the line number,
        // ... because CodeMirror's line count is zero-based.
        this.editor.dispatch({selection: {anchor: this.lineNum - 1}})
      }
    }, 1);
    this.requestUpdate();
  }

  /**
   * Generates an array containing codemirror extensions
   * based on the users preference.
   */
  private getCodeMirrorExtensions() {
    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        indentWithTab,
      ]),
      eventPlugin(this),
    ];

    // Have to make sure that this if statement
    // is triggered even when the value is 0.
    if (this.prefs?.indentUnit >= 0) {
      extensions.push(indentUnit.of(this.prefs.indentUnit));
    }

    if (this.prefs?.syntax_highlighting) {
      extensions.push(
        syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
        //EditorState.language.of(this),
        _css(),
        _cpp(),
        _html(),
        _java(),
        _javascript(),
        _json(),
        _markdown(),
        _php(),
        _python(),
        _rust(),
        _sql(),
        _xml(),
      )
    }

    if (this.prefs?.auto_close_brackets) {
      extensions.push(closeBrackets())
    }

    if (this.prefs?.matchBrackets) {
      extensions.push(bracketMatching())
    }

    // Have to make sure that this if statement
    // is triggered even when the value is 0.
    if (this.prefs?.tabSize >= 0) {
      extensions.push(EditorState.tabSize.of(this.prefs.tabSize));
    }

    if (this._fileContent?.includes('\r\n')) {
      extensions.push(EditorState.lineSeparator.of('\r\n'));
    }

    return [...extensions, basicLightTheme];
  }



  /*_getExtensions(params) {
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
      // value.push(bracketMatching());
    }

    if (params.autoCloseBrackets) {
      // value.push(closeBrackets());
    }

    if (params.indentUnit) {
      value.push(indentUnit.of(params.indentUnit));
    }

    if (params.mode) {
      // value.push(highlightSpecialChars());
      const lang = LANGUAGE_MAP.get(params.mode);
      const langMatch = LanguageDescription.matchLanguageName(languages, lang);
      if (lang && langMatch) {
        value.push(langMatch);
        // value.push(StreamLanguage.define(lang));
        value.push(defaultHighlightStyle);
      }
    }

    if (params.tabSize) {
      value.push(EditorState.tabSize.of(params.tabSize));
      // value.push(tabSize.of(EditorState.tabSize.of(params.tabSize)));
    }

    if (params.lineSeparator && this.fileContent?.includes('\r\n')) {
      value.push(EditorState.lineSeparator.of('\r\n'));
    }

    value.push(highlightActiveLine());
    // value.push(highlightSelectionMatches());
    /* value.push(keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
    ]));

    return value;
  }*/

  setText(t: string) {
    const {selection} = this.editor.state;

    const textLength = t.length;
    const anchor =
      selection.main.anchor > textLength ? textLength : selection.main.anchor;

    this.editor.dispatch({
      annotations: [SetTextCalled.of([])],
      changes: [
        {
          from: 0,
          to: this.editor.state.doc.length,
          insert: t,
        },
      ],
      selection: {
        anchor,
      },
    });

    this.editor.dispatch({effects: EditorView.scrollIntoView(anchor)})
  }
}
