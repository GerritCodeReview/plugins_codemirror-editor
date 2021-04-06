/**
 * @license
 * Copyright (C) 2021 The Android Open Source Project
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
const path = require('path');

function requirePlugin(id) {
  const rollupBinDir = path.dirname(process.argv[1]);
  const pluginPath = require.resolve(id, {paths: [__dirname, rollupBinDir]});
  return require(pluginPath);
}
const resolve = requirePlugin('rollup-plugin-node-resolve');

export default {  // eslint-disable-line
  treeshake: false,
  // This is required for resemblejs
  context: 'window',
  output: {
    format: 'iife',
    compact: true,
  },
  plugins: [resolve({
    customResolveOptions: {
      moduleDirectory: 'external/plugins_npm/node_modules',
    },
  })],
};