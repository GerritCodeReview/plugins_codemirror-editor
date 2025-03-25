/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  lineNumbers,
  highlightActiveLineGutter,
  highlightWhitespace,
  highlightTrailingWhitespace,
} from '@codemirror/view';
import {EditorState, Extension} from '@codemirror/state';
import {
  defaultHighlightStyle,
  indentOnInput,
  foldGutter,
  foldKeymap,
  bracketMatching,
  syntaxHighlighting,
  indentUnit,
} from '@codemirror/language';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import {searchKeymap, highlightSelectionMatches} from '@codemirror/search';
import {closeBrackets, closeBracketsKeymap} from '@codemirror/autocomplete';
import {rulerPlugin} from './ruler';
import {language} from './language';
import {EditPreferencesInfo} from './codemirror-element';

const colorTheme = (dark: boolean) =>
  EditorView.theme(
    {
      '&': {
        color: 'var(--primary-text-color)',
        'background-color': 'var(--background-color-primary)',
      },
      '.cm-gutters': {
        color: 'var(--deemphasized-text-color)',
        'background-color': 'var(--background-color-secondary)',
      },
    },
    {dark}
  );

const trailingspace = () =>
  EditorView.theme({
    '.cm-trailingspace': {
      'background-color': '#fce8e6',
      border: '1px solid #c5221f',
      'border-radius': '2px',
    },
  });

const fixedHeightEditor = (height: number) =>
  EditorView.theme({
    '&': {height: `${height}px`},
    '.cm-scroller': {overflow: 'auto'},
  });

const hideTabsAndSpaces = () =>
  EditorView.theme({
    // Class is created and used by highlightWhitespace()
    // This hides tabs unless show_tabs is enabled in prefs.
    '.cm-highlightTab': {
      'background-image': 'none',
      'background-size': 'none',
      'background-position': 'none',
      'background-repeat': 'none',
      display: 'inline-block',
      'text-decoration': 'inherit',
    },
    '.cm-highlightSpace': {
      'background-image': 'none',
      'background-size': 'none',
    },
  });

const tabTheme = () =>
  EditorView.theme({
    '.cm-tab:before': {
      color: '#5f6368',
      content: "'\\2192'",
      position: 'absolute',
    },
    // Class is created and used by highlightWhitespace()
    '.cm-highlightTab:before': {
      color: '#5f6368',
      content: "'\\2192'",
      position: 'absolute',
    },
  });

export const extensions = (
  height: number,
  prefs?: EditPreferencesInfo,
  fileType?: string,
  fileContent?: string,
  darkMode?: boolean
) => {
  const codeExtensions: Array<Extension> = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      indentWithTab,
    ]),
    trailingspace(),
    fixedHeightEditor(height),
    colorTheme(darkMode ?? false),
    EditorState.tabSize.of(prefs?.tab_size ?? 0),
    highlightWhitespace(),
    hideTabsAndSpaces(),
  ];

  if (!prefs) return codeExtensions;

  if (prefs.line_length) {
    codeExtensions.push(rulerPlugin);
  }

  if (prefs.auto_close_brackets) {
    codeExtensions.push(closeBrackets());
  }
  if (prefs.line_wrapping) {
    codeExtensions.push(EditorView.lineWrapping);
  }

  if (prefs.match_brackets) {
    codeExtensions.push(bracketMatching());
  }

  if (prefs.syntax_highlighting && language(fileType)) {
    codeExtensions.push(
      language(fileType) as Extension,
      syntaxHighlighting(defaultHighlightStyle, {fallback: true})
    );
  }

  if (prefs.show_tabs) {
    codeExtensions.push(tabTheme());
  }

  if (prefs.indent_with_tabs) {
    codeExtensions.push(indentUnit.of('\t'.repeat(prefs.indent_unit ?? 0)));
  } else {
    codeExtensions.push(indentUnit.of(' '.repeat(prefs.indent_unit ?? 0)));
  }

  if (prefs.show_whitespace_errors) {
    codeExtensions.push(highlightTrailingWhitespace());
  }

  if (fileContent?.includes('\r\n')) {
    codeExtensions.push(EditorState.lineSeparator.of('\r\n'));
  }

  return codeExtensions;
};
