/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import 'codemirror';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';
import 'codemirror/mode/go/go';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/yaml/yaml';
import {EditorConfiguration} from 'codemirror';
import {css, html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators';

import {codemirrorStyles} from './codemirror-css';

type ValueChangedEvent<T = string> = CustomEvent<{value: T}>;

declare global {
  const CodeMirror: typeof CodeMirror;
  interface HTMLElementEventMap {
    'content-change': ValueChangedEvent;
  }
  interface HTMLElementTagNameMap {
    'codemirror-element': CodeMirrorElement;
  }
}

@customElement('codemirror-element')
class CodeMirrorElement extends LitElement {
  @property({type: Number}) lineNum?: number;

  @property({type: Object}) params?: EditorConfiguration;

  @query('#wrapper') wrapper?: HTMLElement;

  private initialized = false;

  static override get styles() {
    return [
      codemirrorStyles,
      css`
        .CodeMirror {
          font-family: var(--monospace-font-family);
          height: auto;
        }
        .CodeMirror-linenumbers {
          background-color: var(--background-color-tertiary);
        }
        .CodeMirror-linenumber {
          color: var(--deemphasized-text-color);
        }
        .CodeMirror-ruler {
          border-left: 1px solid var(--border-color);
        }
        .cm-trailingspace {
          background-color: var(--error-background);
        }
      `,
    ];
  }

  override render() {
    return html`<div id="wrapper"></div>`;
  }

  override updated() {
    this.initialize();
  }

  private initialize() {
    if (!this.params || !this.isConnected || !this.wrapper) return;

    if (this.initialized) return;
    this.initialized = true;

    const cm = CodeMirror(this.wrapper, this.params);
    setTimeout(() => {
      cm.refresh();
      cm.focus();
      if (this.lineNum) {
        // We have to take away one from the line number,
        // because CodeMirror's line count is zero-based.
        cm.setCursor(this.lineNum - 1);
      }
    }, 1);
    cm.on('change', e => {
      this.dispatchEvent(
        new CustomEvent('content-change', {
          detail: {value: e.getValue()},
          bubbles: true,
          composed: true,
        })
      );
    });
  }
}
