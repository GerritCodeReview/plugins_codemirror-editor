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
  insertTab
} from '@codemirror/commands';
import {searchKeymap, highlightSelectionMatches} from '@codemirror/search';
import {closeBrackets, closeBracketsKeymap} from '@codemirror/autocomplete';
import {rulerPlugin} from './ruler';
import {language} from './language';
import {EditPreferencesInfo, PreferencesInfo} from './codemirror-element';
import {oneDark} from '@codemirror/theme-one-dark';

const trailingspace = () =>
  EditorView.theme({
    '.cm-trailingspace': {
      'background-color': '#fce8e6',
      "border": '1px solid #c5221f',
      'border-radius': '2px',
    },
  });

const tabsOrSpaces = () =>
  EditorView.theme({
    '.cm-tab:before': {
      color: '#5f6368',
      content: "'\\2192'",
      position: 'absolute',
    },

    // Class is created and used by highlightWhitespace()
    '.cm-highlightTab': {
      'background-image': 'none',
      'background-size': 'none',
      'background-position': 'none',
      'background-repeat': 'none',
      "display": 'inline-block',
      'text-decoration': 'inherit',
    },
    '.cm-highlightTab:before': {
      color: '#5f6368',
      content: "'\\2192'",
      position: 'absolute',
    },
    '.cm-highlightSpace:before': {
      content: "''",
    },
  });

const fixedHeightEditor = (height: number) =>
  EditorView.theme({
    '&': {height: `${height}px`},
    '.cm-scroller': {overflow: 'auto'},
  });

const oneLight = () =>
  EditorView.theme({
    '&': {background: 'white'},
    '.cm-lineNumbers': {'background-color': '#f1f3f4'},
  });


export const extensions = (
    height: number,
    prefs?: EditPreferencesInfo,
    fileType?: string,
    fileContent?: string,
    userPrefs?: PreferencesInfo
) => {
  // This uses the preference to detect whether
  // to use 'tabs' when you use the tab button
  // or to use 'spaces' when using the tab button.
  const tab = prefs?.indent_with_tabs ?
    {
      key: 'Tab',
      preventDefault: true,
      run: insertTab,
    } : indentWithTab;

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
      tab
    ]),
    trailingspace(),
    tabsOrSpaces(),
    fixedHeightEditor(height),
  ];

  if (!prefs) return codeExtensions;

  if (prefs.line_length && prefs.line_length > 0) {
    codeExtensions.push(rulerPlugin);
  }

  if (prefs.auto_close_brackets) {
    codeExtensions.push(closeBrackets());
  }

  if (prefs.indent_unit && prefs.indent_unit >= 0) {
    codeExtensions.push(indentUnit.of(' '.repeat(prefs.indent_unit)));
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
    codeExtensions.push(highlightWhitespace());
  }

  if (prefs.show_whitespace_errors) {
    codeExtensions.push(highlightTrailingWhitespace());
  }

  if (prefs.tab_size && prefs.tab_size >= 0) {
    codeExtensions.push(EditorState.tabSize.of(prefs.tab_size));
  }

  if (fileContent?.includes('\r\n')) {
    codeExtensions.push(EditorState.lineSeparator.of('\r\n'));
  }

  if (userPrefs?.theme === 'DARK') {
    codeExtensions.push(oneDark);
  } else {
    // We set the background to white as it currently defaults to grey.
    codeExtensions.push(oneLight());
  }

  return codeExtensions;
};
