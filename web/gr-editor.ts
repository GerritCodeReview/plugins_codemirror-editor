/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import './codemirror-imports';
import '@gerritcodereview/typescript-api/gerrit';
import {PluginApi} from '@gerritcodereview/typescript-api/plugin';
import {html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

import {CodeMirrorConfig} from './codemirror-imports';
import {setScriptSrc} from './safe-script';

declare global {
  interface HTMLElementTagNameMap {
    'gr-editor': GrEditor;
  }
}

/**
 * This is a standard REST API object:
 * https://gerrit-review.googlesource.com/Documentation/rest-api-accounts.html#edit-preferences-info
 *
 * TODO: Add this object to the plugin API.
 */
interface EditPreferencesInfo {
  tab_size?: number;
  line_length?: number;
  indent_unit?: number;
  show_tabs?: boolean;
  show_whitespace_errors?: boolean;
  syntax_highlighting?: boolean;
  match_brackets?: boolean;
  line_wrapping?: boolean;
  indent_with_tabs?: boolean;
  auto_close_brackets?: boolean;
}

/**
 * This component just loads the CodeMirror js bundle lazily and converts the
 * Gerrit preferences into CodeMirror params.
 */
@customElement('gr-editor')
export class GrEditor extends LitElement {
  @property({type: String}) fileContent?: string;

  @property({type: String}) fileType?: string;

  @property({type: Number}) lineNum?: number;

  @property({type: Object}) prefs?: EditPreferencesInfo;

  @property({type: Object}) plugin?: PluginApi;

  @query('#codemirror') mirror?: HTMLScriptElement;

  override render() {
    if (!window.customElements.get('codemirror-element')) return;

    return html`
      <codemirror-element
        id="codemirror"
        .lineNum=${this.lineNum}
        .params=${this.codeMirrorParams()}
      >
      </codemirror-element>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.loadCodeMirrorElement();
    window.customElements.whenDefined('codemirror-element').then(() => {
      this.requestUpdate();
    });
  }

  private loadCodeMirrorElement() {
    if (document.head.querySelector('#codemirror')) return;

    const script = document.createElement('script');
    script.id = 'codemirror';
    script.crossOrigin = 'anonymous';
    setScriptSrc(script, this.plugin?.url() ?? '');
    document.head.appendChild(script);
  }

  private codeMirrorParams(): CodeMirrorConfig {
    const params: CodeMirrorConfig = {
      value: this.fileContent ?? '',
    };

    if (this.prefs) {
      params.autoCloseBrackets = this.prefs.auto_close_brackets;
      params.cursorHeight = 0.85;
      params.indentUnit = this.prefs.indent_unit;
      params.indentWithTabs = this.prefs.indent_with_tabs;
      params.lineNumbers = true;
      params.lineWrapping = this.prefs.line_wrapping;
      params.matchBrackets = this.prefs.match_brackets;
      params.mode = this.prefs.syntax_highlighting ? this.fileType ?? '' : '';
      params.showTabs = this.prefs.show_tabs;
      params.showTrailingSpace = this.prefs.show_whitespace_errors;
      params.tabSize = this.prefs.tab_size;
      if (this.prefs.line_length) {
        params.rulers = [{column: this.prefs.line_length}];
      }
      if (this.fileContent?.includes('\r\n')) {
        params.lineSeparator = '\r\n';
      }
    }

    return params;
  }
}
