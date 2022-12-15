/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {css} from 'lit';

/**
 * This is just a copy of addon/fold/foldgutter.css.
 * We need to be able to expose this to lit.
 */
export const foldgutterStyles = css`
  .CodeMirror-foldmarker {
    color: blue;
    text-shadow: #b9f 1px 1px 2px, #b9f -1px -1px 2px, #b9f 1px -1px 2px,
      #b9f -1px 1px 2px;
    font-family: arial;
    line-height: 0.3;
    cursor: pointer;
  }
  .CodeMirror-foldgutter {
    width: 0.7em;
  }
  .CodeMirror-foldgutter-open,
  .CodeMirror-foldgutter-folded {
    cursor: pointer;
  }
  .CodeMirror-foldgutter-open:after {
    content: '\25BE';
  }
  .CodeMirror-foldgutter-folded:after {
    content: '\25B8';
  }
`;
