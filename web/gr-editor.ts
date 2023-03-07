/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@gerritcodereview/typescript-api/gerrit';
import {PluginApi} from '@gerritcodereview/typescript-api/plugin';
import {html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {setScriptSrc} from './safe-script';
import './web/element/codemirror-element';

declare global {
  interface HTMLElementTagNameMap {
    'gr-editor': GrEditor;
  }
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

  @property({type: Object}) prefs?: unknown;

  @property({type: Object}) plugin?: PluginApi;

  @property({type: Boolean}) darkMode = false;

  @query('#codemirror') mirror?: HTMLScriptElement;

  override render() {
    if (!window.customElements.get('codemirror-element')) return;

    return html`
      <codemirror-element
        id="codemirror"
        .lineNum=${this.lineNum}
        .prefs=${this.prefs}
        .fileContent=${this.fileContent}
        .fileType=${this.fileType}
        ?darkMode=${this.darkMode}
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
}
