/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EditorView,
  ViewUpdate,
  ViewPlugin
} from '@codemirror/view';

// Kindly provided by https://discuss.codemirror.net/t/how-to-implement-ruler/4616/4
function generateRulerPlugin() {
  let width: number = 0;
  let dom: HTMLDivElement;
  let defaultCharacterWidth: number = 1;

  class RulerPlugin {
      containerDom: HTMLDivElement;
      constructor(view: EditorView) {
          this.containerDom = view.dom.appendChild(document.createElement("div"));
          this.containerDom.style.cssText=`
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              overflow: hidden;
          `
          dom = this.containerDom.appendChild(document.createElement("div"));
          dom.style.cssText = `
              position: absolute; 
              border-right: 1px dotted gray; 
              height: 100%; 
              opacity: 0.7;
          `;
          // XXX: This should be equal to the amount of padding on a line.
          // This value should be extracted from CodeMirror rather than hardcoded.
          dom.style.width = `4px`;
          defaultCharacterWidth = view.defaultCharacterWidth;
          updateRulerWidth(80);
      }

      update(update: ViewUpdate) {
          defaultCharacterWidth = update.view.defaultCharacterWidth;
          if (update.viewportChanged) {
              updateRulerWidth(width, true);
          }
      }

      destroy() {
          dom.remove();
      }
  }
  
  function updateRulerWidth(newWidth: number, force = false) {
    console.log(width * defaultCharacterWidth)
      if ((newWidth !== width || force) && dom) {
          width = newWidth;
          dom.style.left = `${width * defaultCharacterWidth}px`;
      }
  }

  return { rulerPlugin: ViewPlugin.fromClass(RulerPlugin), updateRulerWidth };
}

const { rulerPlugin, updateRulerWidth } = generateRulerPlugin();

export {
  rulerPlugin,
  updateRulerWidth
}
