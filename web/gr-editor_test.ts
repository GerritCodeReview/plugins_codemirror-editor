/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import './gr-editor';
import './element/codemirror-element';
import {assert, fixture, html} from '@open-wc/testing';
import {GrEditor} from './gr-editor';
import {queryAndAssert} from './test/test-util';
import {PluginApi} from '@gerritcodereview/typescript-api/plugin';
import {CodeMirrorElement} from './element/codemirror-element';

suite('gr-editor tests', () => {
  let element: GrEditor;

  setup(async () => {
    element = await fixture<GrEditor>(html`<gr-editor></gr-editor>`);
    element.lineNum = 123;
    element.prefs = {
      match_brackets: true,
    };
    element.plugin = {
      getPluginName: () => 'codemirror-editor',
      url: () => 'http://test-host/test-path',
    } as unknown as PluginApi;
    await element.updateComplete;
  });

  teardown(() => {
    const script = document.head.querySelector('#codemirror');
    if (script) script.remove();
  });

  test('presence of script', () => {
    const script = queryAndAssert<HTMLElement>(document.head, '#codemirror');
    assert.equal(script.tagName, 'SCRIPT');
  });

  test('presence of codemirror-element', () => {
    const cmElement = queryAndAssert<HTMLElement>(
      element,
      'codemirror-element'
    );
    assert.equal(cmElement.tagName, 'CODEMIRROR-ELEMENT');
  });

  test('properties of codemirror-element', () => {
    const cmElement = queryAndAssert<CodeMirrorElement>(
      element,
      'codemirror-element'
    );
    assert.equal(cmElement.lineNum, 123);
    assert.isTrue(cmElement.params?.matchBrackets);
  });
});
