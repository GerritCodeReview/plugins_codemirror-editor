/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators';
import {EditorView} from '@codemirror/view';
import {EditorState} from '@codemirror/state';
import {updateRulerWidth} from './ruler';
import {extensions} from './extensions';

type ValueChangedEvent<T = string> = CustomEvent<{value: T}>;

declare global {
  interface HTMLElementEventMap {
    'content-change': ValueChangedEvent;
  }
  interface HTMLElementTagNameMap {
    // @ts-ignore TS2717: Subsequent property declarations must have the same
    // type.
    'codemirror-element': CodeMirrorElement;
  }
}

/**
 * This is a standard REST API object:
 * https://gerrit-review.googlesource.com/Documentation/rest-api-accounts.html#edit-preferences-info
 *
 * TODO: Add this object to the plugin API.
 */
export interface EditPreferencesInfo {
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

@customElement('codemirror-element')
export class CodeMirrorElement extends LitElement {
  @property({type: Number}) lineNum?: number;

  @property({type: String}) fileContent?: string;

  @property({type: String}) fileType?: string;

  @property({type: Object}) prefs?: EditPreferencesInfo;

  @property({type: Boolean}) darkMode = false;

  @query('#wrapper')
  wrapper!: HTMLElement;

  private initialized = false;

  static override get styles() {
    return [
      css`
        .cm-editor {
          font-family: 'Roboto Mono', 'SF Mono', 'Lucida Console', Monaco,
            monospace;
          /* CodeMirror has a default z-index of 4. Set to 0 to avoid collisions with fixed header. */
          z-index: 0;
        }
        .CodeMirror-ruler {
          border-left: 1px solid #ddd;
        }
        .cm-editor .cm-content {
          font-family: 'Roboto Mono', 'SF Mono', 'Lucida Console', Monaco,
            monospace;
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
    if (!this.isConnected || !this.wrapper) return;

    if (this.initialized) return;
    this.initialized = true;

    const offsetTop = this.getBoundingClientRect().top;
    const clientHeight = window.innerHeight ?? document.body.clientHeight;
    // We are setting a fixed height, because for large files we want to
    // benefit from CodeMirror's virtual scrolling.
    // 80px is roughly the size of the bottom margins plus the footer height.
    // This ensures the height of the textarea doesn't push out of screen.
    const height = clientHeight - offsetTop - 80;

    const editor = new EditorView({
      state: EditorState.create({
        doc: this.fileContent ?? '',
        extensions: [
          ...extensions(
            height,
            this.prefs,
            this.fileType,
            this.fileContent ?? '',
            this.darkMode
          ),
          EditorView.updateListener.of(update => {
            // Set ruler width to 72 for commit messages,
            // as this is the recommended line length for git commit messages.
            if (this.fileType?.includes('x-gerrit-commit-message')) {
              updateRulerWidth(72, update.view.defaultCharacterWidth, true);
            } else if (this.prefs?.line_length) {
              // This is required to be in the setTimeout() to ensure the
              // line is set as correctly as possible.
              updateRulerWidth(
                this.prefs.line_length,
                update.view.defaultCharacterWidth,
                true
              );
            }

            if (update.docChanged) {
              this.dispatchEvent(
                new CustomEvent('content-change', {
                  detail: {value: update.state.doc.toString()},
                  bubbles: true,
                  composed: true,
                })
              );
            }
          }),
          EditorView.domEventHandlers({
            keydown(e: KeyboardEvent) {
              // Exempt the ctrl/command+s key from preventing events from propagating
              // through the app. This is because we use it to save changes.
              if (!e.metaKey && !e.ctrlKey) {
                e.stopPropagation();
              }

              // There is an issue where you paste and immediately
              // press ctrl+s/cmd+s after, it would trigger the
              // web browsers file browser rather then gr-editor-view
              // intercepting ctrl+s/cmd+s.
              if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
                e.stopPropagation();
              }
            },
          }),
        ],
      }),
      parent: this.wrapper as Element,
    });

    editor.focus();

    if (this.lineNum) {
      this.setCursorToLine(editor, this.lineNum);
    }
  }

  setCursorToLine(view: EditorView, lineNum: number) {
    const totalLines = view.state.doc.lines;
    // If you try going to a line that does not exist
    // codemirror will error out. Instead lets just log.
    // Line 1 will be selected automatically.
    if (lineNum < 1 || lineNum > totalLines) {
      console.warn(`Line number ${lineNum} is out of bounds (valid range: 1 - ${totalLines}).`);
      return;
    }

    const line = view.state.doc.line(lineNum);
    view.dispatch({
      selection: { anchor: line.from },
      scrollIntoView: true
    });
    view.focus();
  }
}
