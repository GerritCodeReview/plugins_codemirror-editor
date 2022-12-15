/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {css} from 'lit';

/**
 * This is just a copy of addon/scroll/simplescrollbars.css.
 * We need to be able to expose this to lit.
 */
export const simpleScrollStyles = css`
  .CodeMirror-simplescroll-horizontal div,
  .CodeMirror-simplescroll-vertical div {
    position: absolute;
    background: #ccc;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #bbb;
    border-radius: 2px;
  }

  .CodeMirror-simplescroll-horizontal,
  .CodeMirror-simplescroll-vertical {
    position: absolute;
    z-index: 6;
    background: #eee;
  }

  .CodeMirror-simplescroll-horizontal {
    bottom: 0;
    left: 0;
    height: 8px;
  }
  .CodeMirror-simplescroll-horizontal div {
    bottom: 0;
    height: 100%;
  }

  .CodeMirror-simplescroll-vertical {
    right: 0;
    top: 0;
    width: 8px;
  }
  .CodeMirror-simplescroll-vertical div {
    right: 0;
    width: 100%;
  }

  .CodeMirror-overlayscroll .CodeMirror-scrollbar-filler,
  .CodeMirror-overlayscroll .CodeMirror-gutter-filler {
    display: none;
  }

  .CodeMirror-overlayscroll-horizontal div,
  .CodeMirror-overlayscroll-vertical div {
    position: absolute;
    background: #bcd;
    border-radius: 3px;
  }

  .CodeMirror-overlayscroll-horizontal,
  .CodeMirror-overlayscroll-vertical {
    position: absolute;
    z-index: 6;
  }

  .CodeMirror-overlayscroll-horizontal {
    bottom: 0;
    left: 0;
    height: 6px;
  }
  .CodeMirror-overlayscroll-horizontal div {
    bottom: 0;
    height: 100%;
  }

  .CodeMirror-overlayscroll-vertical {
    right: 0;
    top: 0;
    width: 6px;
  }
  .CodeMirror-overlayscroll-vertical div {
    right: 0;
    width: 100%;
  }
`;
