/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import './codemirror-imports';

import {EditorConfiguration} from 'codemirror';
import {css, html, LitElement} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

import {codemirrorStyles} from './codemirror-css';
import {dialogStyles} from './dialog-css';
import {foldgutterStyles} from './foldgutter-css';
import {searchMatchStyles} from './matchesonscrollbar-css';
import {simpleScrollStyles} from './simplescrollbars-css';

type ValueChangedEvent<T = string> = CustomEvent<{value: T}>;

declare global {
  interface HTMLElementEventMap {
    'content-change': ValueChangedEvent;
  }
  interface HTMLElementTagNameMap {
    'codemirror-element': CodeMirrorElement;
  }
}

@customElement('codemirror-element')
export class CodeMirrorElement extends LitElement {
  @property({type: Number}) lineNum?: number;

  @property({type: Object}) params?: EditorConfiguration;

  @query('#wrapper') wrapper?: HTMLElement;

  private initialized = false;

  static override get styles() {
    return [
      codemirrorStyles,
      dialogStyles,
      foldgutterStyles,
      searchMatchStyles,
      simpleScrollStyles,
      css`
        .CodeMirror {
          font-family: var(--monospace-font-family);
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
          border: 1px solid var(--error-foreground);
          border-radius: 2px;
        }
        .cm-tab:before {
          color: var(--deemphasized-text-color);
          content: '\\2192';
          position: absolute;
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

    // eslint-disable-next-line new-cap
    const cm = CodeMirror(this.wrapper, this.params);
    setTimeout(() => {
      const offsetTop = this.getBoundingClientRect().top;
      const clientHeight = window.innerHeight ?? document.body.clientHeight;
      // We are setting a fixed height, because for large files we want to
      // benefit from CodeMirror's virtual scrolling.
      // 80px is roughly the size of the bottom margins plus the footer height.
      // This ensures the height of the textarea doesn't push out of screen.
      const height = clientHeight - offsetTop - 80;
      cm.refresh();
      cm.focus();
      cm.setSize(null, height < 600 ? 600 : height);
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
    cm.getInputField().addEventListener('keydown', e => {
      // Exempt the ctrl/command+s key from preventing events from propagating
      // through the app. This is because we use it to save changes.
      if (!e.metaKey && !e.ctrlKey) {
        e.stopPropagation();
      }
    });
  }
}
