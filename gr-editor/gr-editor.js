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

// Run a callback when HTMLImports are ready or immediately if
// this api is not available.
function whenImportsReady(cb) {
  if (window.HTMLImports) {
    HTMLImports.whenReady(cb);
  } else {
    cb();
  }
}

/**
 * Convenience method for importing an HTML document imperatively. Mostly copied
 * from polymer/lib/utils/import-href.html.
 *
 * This method creates a new `<link rel="import">` element with
 * the provided URL and appends it to the document to start loading.
 * In the `onload` callback, the `import` property of the `link`
 * element will contain the imported document contents.
 *
 * @param {string} href URL to document to load.
 * @param {?function(!Event):void=} onload Callback to notify when an import successfully
 *   loaded.
 * @param {?function(!ErrorEvent):void=} onerror Callback to notify when an import
 *   unsuccessfully loaded.
 */
function importHref(href, onload, onerror) {
  let link =
      /** @type {HTMLLinkElement} */
      (document.head.querySelector('link[href="' + href + '"][import-href]'));
  if (!link) {
    link = /** @type {HTMLLinkElement} */ (document.createElement('link'));
    link.setAttribute('rel', 'import');
    link.setAttribute('href', href);
    link.setAttribute('import-href', '');
  }
  // NOTE: the link may now be in 3 states: (1) pending insertion,
  // (2) inflight, (3) already loaded. In each case, we need to add
  // event listeners to process callbacks.
  const cleanup = function() {
    link.removeEventListener('load', loadListener);
    link.removeEventListener('error', errorListener);
  };
  const loadListener = function(event) {
    cleanup();
    // In case of a successful load, cache the load event on the link so
    // that it can be used to short-circuit this method in the future when
    // it is called with the same href param.
    link.__dynamicImportLoaded = true;
    if (onload) {
      whenImportsReady(() => {
        onload(event);
      });
    }
  };
  const errorListener = function(event) {
    cleanup();
    // In case of an error, remove the link from the document so that it
    // will be automatically created again the next time `importHref` is
    // called.
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    if (onerror) {
      whenImportsReady(() => {
        onerror(event);
      });
    }
  };
  link.addEventListener('load', loadListener);
  link.addEventListener('error', errorListener);
  if (link.parentNode == null) {
    document.head.appendChild(link);
    // if the link already loaded, dispatch a fake load event
    // so that listeners are called and get a proper event argument.
  } else if (link.__dynamicImportLoaded) {
    link.dispatchEvent(new Event('load'));
  }
  return link;
}

// we need to be on codemirror 5.33.0+ to get the support for
// text/x-php in CodeMirror.findModeByMIME
const LANGUAGE_MAP = {
  'text/x-php': 'php',
};

class GrEditor extends Polymer.Element {
  /**
   * Fired when the content of the editor changes.
   *
   * @event content-change
   */

  /** @returns {string} name of the component */
  static get is() {
    return 'gr-editor';
  }

  /**
   * Defines properties of the component
   *
   * @returns {?}
   */
  static get properties() {
    return {
      fileContent: String,
      fileType: String,
      lineNum: Number,
      mirror: Object,
      prefs: Object,
      plugin: Object,
    };
  }

  /** @returns {?} template for this component */
  static get template() {
    return Polymer.html`
      <codemirror-element
        id="codemirror"
        line-num="[[lineNum]]">
      </codemirror-element>
    `;
  }

  /** Hook on connectedCallback */
  connectedCallback() {
    super.connectedCallback();
    this._initializeMirror();
  }

  /** @returns {!Promise} Initialize code mirror editor */
  _initializeMirror() {
    return new Promise((resolve, reject) => {
      this._importCodeMirror().then(() => {
        const params = this.getCodeMirrorParams(
            this.fileType,
            this.fileContent,
            this.prefs
        );
        this.mirror = this.$.codemirror;
        this.mirror.setParams(params);
        this._addEventListeners();
        resolve();
      });
    });
  }

  /** @returns {!Promise} Lazy load the actual codemirror editor */
  _importCodeMirror() {
    const codemirrorElementFile = '/static/codemirror-element.html';
    const url = this.plugin.url(codemirrorElementFile);
    return new Promise((resolve, reject) => {
      importHref(url, resolve, reject);
    });
  }

  /** Set up content listeners */
  _addEventListeners() {
    this.mirror.addEventListener('content-change', e => {
      this.dispatchEvent(
          new CustomEvent('content-change', {
            detail: {value: e.detail.value},
            bubbles: true,
            composed: true,
          })
      );
    });
  }

  /**
   * Retrieve params for the editor
   *
   * @param {string} type
   * @param {string} value
   * @param {Object} prefs
   * @returns {Object}
   */
  getCodeMirrorParams(type, value, prefs) {
    const params = {value};

    params.scrollbarStyle = 'overlay';

    if (prefs) {
      // TODO: Add gerrit's customizations from java codemirror to javascript
      // gerrit-gwtui/src/main/java/net/codemirror/lib/Extras.java
      params.autoCloseBrackets = prefs.auto_close_brackets;
      params.cursorHeight = 0.85;
      params.indentUnit = prefs.indent_unit;
      params.indentWithTabs = prefs.indent_with_tabs;
      // TODO(kaspern): Add support for keymaps.
      // params.keyMap = prefs.key_map_type.toLowerCase();
      params.lineNumbers = true;
      params.lineWrapping = prefs.line_wrapping;
      params.matchBrackets = prefs.match_brackets;
      // TODO: Add support for a new commit msg MIME type
      // Support for this is somewhere in gerrit's codebase
      // needs backporting to javascript
      params.mode = prefs.syntax_highlighting ? this._mapFileType(type) : '';
      params.showTabs = prefs.show_tabs;
      params.showTrailingSpace = prefs.show_whitespace_errors;
      params.tabSize = prefs.tab_size;
      // TODO(kaspern): Add support for themes.
      // params.theme = prefs.theme.toLowerCase();

      params.rulers = [{column: prefs.line_length}];
      if (value && value.includes('\r\n')) {
        params.lineSeparator = '\r\n';
      }
    }

    return params;
  }

  /**
   * Determine file type with local overrides
   *
   * @param {string} type
   * @returns {string}
   */
  _mapFileType(type) {
    return LANGUAGE_MAP[type] || type || '';
  }
}

customElements.define(GrEditor.is, GrEditor);

if (window.Gerrit) {
  Gerrit.install(plugin => {
    plugin.registerCustomComponent('editor', 'gr-editor', {replace: true});
  });
}
