/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import 'codemirror';

import {EditorConfiguration} from 'codemirror';

declare global {
  interface HTMLElementTagNameMap {
    'codemirror-element': CodeMirrorElement;
  }
}

/**
 * The type `codemirror.EditorConfiguration` is just outdated, so we have to add
 * some props manually here.
 */
export interface CodeMirrorConfig extends EditorConfiguration {
  autoCloseBrackets?: boolean;
  matchBrackets?: boolean;
  showTabs?: boolean;
  showTrailingSpace?: boolean;
  lineSeparator?: string;
  rulers?: false | ReadonlyArray<number | Ruler> | undefined;
}

/**
 * <codemirror-element> is defined in a separate javascript bundle, so let's
 * define its interface here.
 */
interface CodeMirrorElement extends HTMLElement {
  lineNum?: number;
  params?: CodeMirrorConfig;
}

interface Ruler {
  column: number;
  className?: string | undefined;
  color?: string | undefined;
  lineStyle?: string | undefined;
  width?: string | undefined;
}
