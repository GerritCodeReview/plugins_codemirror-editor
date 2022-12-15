/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export function queryAll<E extends Element = Element>(
  el: Element,
  selector: string
): NodeListOf<E> {
  if (!el) throw new Error('element not defined');
  const root = el.shadowRoot ?? el;
  return root.querySelectorAll<E>(selector);
}

export function query<E extends Element = Element>(
  el: Element | undefined,
  selector: string
): E | undefined {
  if (!el) return undefined;
  const root = el.shadowRoot ?? el;
  return root.querySelector<E>(selector) ?? undefined;
}

export function queryAndAssert<E extends Element = Element>(
  el: Element | undefined,
  selector: string
): E {
  const found = query<E>(el, selector);
  if (!found) throw new Error(`selector '${selector}' did not match anything'`);
  return found;
}
