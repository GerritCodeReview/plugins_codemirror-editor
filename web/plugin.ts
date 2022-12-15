/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import '@gerritcodereview/typescript-api/gerrit';
import './gr-editor';

window.Gerrit.install(plugin => {
  plugin.registerCustomComponent('editor', 'gr-editor', {replace: true});
});
