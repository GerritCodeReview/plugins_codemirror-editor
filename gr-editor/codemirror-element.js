/**
 * @license
 * Copyright (C) 2017 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class CodeMirrorElement extends Polymer.GestureEventListeners(
    Polymer.LegacyElementMixin(
        Polymer.Element)) {
  /**
   * Fired when the content of the editor changes.
   *
   * @event content-change
   */

  /** @returns {string} name of the component */
  static get is() { return 'codemirror-element'; }

  static get properties() {
    return {
      lineNum: Number,
    };
  }

  ready() {
    super.ready();
    this.scopeSubtree(this.$.wrapper, true);
  }

  attached() {
    super.attached();
    this._initialize();
  }

  setParams(params) {
    this._params = params;
    this._initialize();
  }

  _initialize() {
    // setParams(params) can be called before or after attached().
    // Codemirror must be initialized only after both functions were called
    if (!this._params || !this.isAttached) {
      return;
    }
    // attached() can be called multiple times.
    // Initialization must be done only once
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.scopeSubtree(this.$.wrapper, true);
    // eslint-disable-next-line new-cap
    this._nativeMirror = window.CodeMirror(this.$.wrapper, this._params);
    setTimeout(() => {
      const offsetTop =
          this._nativeMirror.display.wrapper.getBoundingClientRect().top;
      const clientHeight =
          window.innerHeight || document.clientHeight || document.getElementByTagName('body').clientHeight;
      // We take 100 from height to ensure that the height of the
      // textarea doesn't push out of screen.
      const height = clientHeight - offsetTop - 100;
      this._nativeMirror.refresh();
      this._nativeMirror.focus();
      this._nativeMirror.setSize(null, height < 600 ? 600 : height;
      if (this.lineNum) {
        // We have to take away one from the line number,
        // ... because CodeMirror's line count is zero-based.
        this._nativeMirror.setCursor(this.lineNum - 1);
      }
    }, 1);
    this._addEventListeners();
  }

  _addEventListeners() {
    this._nativeMirror.on('change', e => {
      this.dispatchEvent(
          new CustomEvent('content-change', {detail: {value: e.getValue()}})
      );
    });
    this._nativeMirror.getInputField().addEventListener('keydown', e => {
      // Exempt the ctrl/command+s key from preventing events from propagating
      // through the app. This is because we use it to save changes.
      if (!e.metaKey && !e.ctrlKey) {
        e.stopPropagation();
      }
    });
  }
}

customElements.define(CodeMirrorElement.is, CodeMirrorElement);
