/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export function setScriptSrc(el: HTMLScriptElement, pluginUrl: string) {
  el.src = `${pluginUrl}static/codemirror_element.js`;
}
