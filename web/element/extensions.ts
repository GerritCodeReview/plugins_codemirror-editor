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
  indentOnInput,
  foldGutter,
  foldKeymap,
  bracketMatching,
  syntaxHighlighting,
  indentUnit,
  HighlightStyle,
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
import {tags as t} from '@lezer/highlight';

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

export const gerritTheme = HighlightStyle.define([
  {tag: [t.standard(t.tagName), t.tagName], color: 'var(--syntax-tag-color)'},
  {tag: t.comment, color: 'var(--syntax-comment-color)'},
  {tag: [t.className, t.propertyName], color: 'var(--syntax-attr-color)'},
  {tag: t.variableName, color: 'var(--syntax-variable-color)'},
  {tag: [t.attributeName, t.operator], color: 'var(--syntax-attr-color)'},
  {tag: t.number, color: 'var(--syntax-number-color)'},
  {tag: t.keyword, color: 'var(--syntax-keyword-color)'},
  {tag: t.typeName, color: 'var(--syntax-type-color)'},
  {tag: t.typeOperator, color: 'blue'},
  {tag: t.string, color: 'var(--syntax-string-color)'},
  {tag: t.regexp, color: 'var(--syntax-regexp-color)'},
  {tag: t.meta, color: 'var(--syntax-meta-color)'},
  {tag: [t.name, t.quote], color: 'var(--syntax-title-color)'},
  {tag: t.definition(t.variableName), color: '#00f'},
  {tag: t.local(t.variableName), color: '#30a'},
  {tag: t.definition(t.propertyName), color: '#00c'},
  {
    tag: [t.heading, t.strong],
    color: 'var(--syntax-strong-color)',
    fontWeight: 'bold',
  },
  {tag: t.emphasis, fontStyle: 'italic'},
  {tag: t.deleted, color: '#a11'},
  {tag: t.inserted, color: '#164'},
  {tag: t.literal, color: 'var(--syntax-literal-color)'},
  {
    tag: [t.atom, t.bool, t.special(t.variableName)],
    color: 'var(--syntax-literal-color)',
  },
  {tag: [t.url, t.escape, t.link], color: 'var(--syntax-string-color)'},
  {tag: t.special(t.string), color: '#e40'},
  {tag: t.link, textDecoration: 'underline'},
  {tag: t.strikethrough, textDecoration: 'line-through'},
  {tag: t.invalid, color: '#f00'},
]);

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
      syntaxHighlighting(gerritTheme, {fallback: true})
    );
  }

  if (prefs.show_tabs) {
    codeExtensions.push(tabTheme());
  }

  if (prefs.indent_with_tabs) {
    codeExtensions.push(indentUnit.of('\t'));
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
