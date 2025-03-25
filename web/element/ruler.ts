/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {EditorView, ViewPlugin} from '@codemirror/view';

// Kindly provided by https://discuss.codemirror.net/t/how-to-implement-ruler/4616/4
function generateRulerPlugin() {
  let width = 0;
  let rulerElement: HTMLDivElement;

  class RulerPlugin {
    containerElement: HTMLDivElement;

    constructor(view: EditorView) {
      this.containerElement = view.dom.appendChild(
        document.createElement('div')
      );
      this.containerElement.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `;
      rulerElement = this.containerElement.appendChild(
        document.createElement('div')
      );
      rulerElement.style.cssText = `
        position: absolute;
        border-right: 1px solid #dadce0;
        height: 100%;
        opacity: 0.7;
      `;
      // TODO: This should be equal to the amount of padding on a line.
      // This value should be extracted from CodeMirror rather than hardcoded.
      rulerElement.style.width = '4px';
    }

    destroy() {
      rulerElement.remove();
    }
  }

  function updateRulerWidth(
    newWidth: number,
    defaultWidth: number,
    force = false
  ) {
    if ((newWidth !== width || force) && rulerElement) {
      width = newWidth;
      rulerElement.style.left = `${width * defaultWidth}px`;
    }
  }

  return {rulerPlugin: ViewPlugin.fromClass(RulerPlugin), updateRulerWidth};
}

const {rulerPlugin, updateRulerWidth} = generateRulerPlugin();

export {rulerPlugin, updateRulerWidth};
