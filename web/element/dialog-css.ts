/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {css} from 'lit';

/**
 * This is just a copy of addon/dialog/dialog.css.
 * We need to be able to expose this to lit.
 */
export const dialogStyles = css`
  .CodeMirror-dialog {
    position: absolute;
    left: 0;
    right: 0;
    background: inherit;
    z-index: 15;
    padding: 0.1em 0.8em;
    overflow: hidden;
    color: inherit;
  }

  .CodeMirror-dialog-top {
    border-bottom: 1px solid #eee;
    top: 0;
  }

  .CodeMirror-dialog-bottom {
    border-top: 1px solid #eee;
    bottom: 0;
  }

  .CodeMirror-dialog input {
    border: none;
    outline: none;
    background: transparent;
    width: 20em;
    color: inherit;
    font-family: monospace;
  }

  .CodeMirror-dialog button {
    font-size: 70%;
  }
`;
