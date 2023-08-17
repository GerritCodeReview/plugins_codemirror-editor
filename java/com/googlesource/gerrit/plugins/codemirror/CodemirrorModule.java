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
import com.google.gerrit.extensions.webui.WebUiPlugin;

/**
 * The only reason for having this module is that this plugin consists of
 * multiple js bundles, so we have to create a proper JAR file to serve them.
 * And thus we also need this entry point module for the `gerrit_plugin` target.
 */
public class CodemirrorModule extends RestApiModule {
  @Override
  protected void configure() {
    DynamicSet.bind(binder(), WebUiPlugin.class)
        .toInstance(new JavaScriptPlugin("codemirror_editor.js"));
  }
}
