// Copyright (C) 2017 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function(window) {
  'use strict';

  var ELEMENT = '/static/codemirror-editor.html';

  /**
   * Create an empty DeleteProjectPlugin instance.
   *
   * @param {Plugin} gerritPlugin An object used to contain the plugin.
   *    Schema for Plugin: https://goo.gl/6nfYna.
   *
   * TODO: Convert class to (es6 syntax) once we drop support for GWTUI.
   *
   */
  function CodeMirrorEditorPlugin(gerritPlugin) {
    this._gerritPlugin = gerritPlugin;
    this._element = null;
  }

  CodeMirrorEditorPlugin.prototype.handleInstalling = function() {
    return this.handleEditor();
  }

  /** @return {Promise} Resolves when the element is loaded. */
  CodeMirrorEditorPlugin.prototype.loadElement = function() {
    return new Promise((resolve, reject) => {
      Polymer.Base.importHref(
          this._gerritPlugin.url(ELEMENT), resolve, reject);
    });
  }

  CodeMirrorEditorPlugin.prototype.handleEditor = function() {
    this.loadElement().catch((err) => {
      console.error('Could not load delete project element', err);
    });
  }

  window.Gerrit.install(function(self) {
      if (window.Polymer) {
        // Low-level API
        var plugin = new CodeMirrorEditorPlugin(self);
        plugin.handleInstalling();
        self.registerCustomComponent('editor', 'codemirror-editor', {replace: true});
      }
  });

  if (window.Polymer) {
    window.__CodeMirrorEditorPlugin = window.__CodeMirrorEditorPlugin || CodeMirrorEditorPlugin;
  }
})(window);
