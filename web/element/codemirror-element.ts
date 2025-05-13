/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
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

  @query('#result')
  result!: HTMLElement;

  private initialized = false;

  private onResize: (() => void) | null = null;

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
        #statusLine {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: #f7f7f7;
          border-top: 1px solid #ddd;
          border-right: 1px solid #ddd;
        }
        #statusLine div {
          height: inherit;
        }
        .cursorPosition {
          display: inline-block;
          margin: 0 5px 0 35px;
          white-space: nowrap;
        }
      `,
    ];
  }

  override render() {
    return html`
      <div id="wrapper"></div>
      <div class="statusLine">
        <div class="cursorPosition">
          <span id="result"></span>
        </div>
      </div>
    `;
  }

  override updated() {
    this.initialize();
  }

  private initialize() {
    if (!this.isConnected || !this.wrapper) return;

    if (this.initialized) return;
    this.initialized = true;

    const editor = new EditorView({
      state: EditorState.create({
        doc: this.fileContent ?? '',
        extensions: [
          ...extensions(
            this.calculateHeight(),
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
          EditorView.updateListener.of(update => {
            if (update.selectionSet) {
              this.updateCursorPosition(update.view);
            }
          }),
        ],
      }),
      parent: this.wrapper as Element,
    });

    editor.focus();

    if (this.lineNum) {
      this.setCursorToLine(editor, this.lineNum);
    }

    // Makes sure to show line number and column number on initial
    // load.
    this.updateCursorPosition(editor);

    this.onResize = () => this.updateEditorHeight(editor);
    window.addEventListener('resize', this.onResize);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.onResize) {
      window.removeEventListener('resize', this.onResize);
      this.onResize = null;
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

  private updateCursorPosition(view: EditorView) {
    const cursor = view.state.selection.main.head;
    const line = view.state.doc.lineAt(cursor);
    if (this.result) {
      this.result.textContent = `Line: ${line.number}, Column: ${cursor - line.from + 1}`;
    }
  }

  private calculateHeight() {
    const offsetTop = this.getBoundingClientRect().top;
    const clientHeight = window.innerHeight ?? document.body.clientHeight;
    // We take offsetTop twice to ensure the height of the texarea doesn't push
    // out of screen. We no longer do a hardcore value which was 80 before.
    // offsetTop seems to be what we've been looking for to do it dynamically.
    return Math.max(0, clientHeight - offsetTop - offsetTop);
  }

  private updateEditorHeight(editor: EditorView) {
    const height = this.calculateHeight();
    const editorElement = editor.dom;
    if (editorElement) {
      editorElement.style.height = `${height}px`;
    }
  }
}
