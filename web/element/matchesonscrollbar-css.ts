/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {css} from 'lit';

/**
 * This is just a copy of addon/search/matchesonscrollbar.css.
 * We need to be able to expose this to lit.
 */
export const searchMatchStyles = css`
  .CodeMirror-search-match {
    background: gold;
    border-top: 1px solid orange;
    border-bottom: 1px solid orange;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    opacity: 0.5;
  }
`;
