/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import './codemirror-element';
import {assert, fixture, html} from '@open-wc/testing';
import {CodeMirrorElement} from './codemirror-element';

suite('gr-editor tests', () => {
  let element: CodeMirrorElement;

  setup(async () => {
    element = await fixture<CodeMirrorElement>(
      html`<codemirror-element></codemirror-element>`
    );
    element.lineNum = 123;
    element.params = {
      matchBrackets: true,
    };
    await element.updateComplete;
  });

  teardown(() => {});

  test('render', () => {
    assert.shadowDom.equal(
      element,
      /* HTML */ `
        <div id="wrapper">
          <div class="CodeMirror cm-s-default" translate="no">
            <div>
              <textarea
                autocapitalize="off"
                autocorrect="off"
                spellcheck="false"
                tabindex="0"
              >
              </textarea>
            </div>
            <div
              class="CodeMirror-vscrollbar"
              cm-not-content="true"
              tabindex="-1"
            >
              <div></div>
            </div>
            <div
              class="CodeMirror-hscrollbar"
              cm-not-content="true"
              tabindex="-1"
            >
              <div></div>
            </div>
            <div
              class="CodeMirror-scrollbar-filler"
              cm-not-content="true"
            ></div>
            <div class="CodeMirror-gutter-filler" cm-not-content="true"></div>
            <div class="CodeMirror-scroll" tabindex="-1">
              <div class="CodeMirror-sizer">
                <div>
                  <div class="CodeMirror-lines" role="presentation">
                    <div role="presentation">
                      <div class="CodeMirror-measure">
                        <pre class="CodeMirror-line-like"></pre>
                      </div>
                      <div class="CodeMirror-measure"></div>
                      <div></div>
                      <div class="CodeMirror-cursors">
                        <div class="CodeMirror-cursor"></div>
                      </div>
                      <div class="CodeMirror-code" role="presentation">
                        <pre class="CodeMirror-line" role="presentation"></pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div></div>
              <div class="CodeMirror-gutters"></div>
            </div>
          </div>
        </div>
      `,
      {
        ignoreTags: ['span'],
        ignoreAttributes: ['style'],
      }
    );
  });
});
