# CodeMirror Editor

A plugin that uses CodeMirror to provide a rich code editing experience in PolyGerrit.

## UI plugin

This plugin defines a Lit web component `<gr-codemirror-editor>` which embedds one CodeMirror 6 instance.
This element replaces the default editor and can be used to edit files in Gerrit.

All available language support packages are bundled with the editor.


For checking or fixing eslint formatter problems run:

    bazel test //plugins/codemirror-editor/gr-codemirror-editor:lint_test
    bazel run //plugins/codemirror-editor/gr-codemirror-editor:lint_bin -- --fix "$(pwd)/plugins/codemirror-editor/gr-codemirror-editor"


## UI tests

To run UI tests here will need install dependencies from both npm and bower.

`npm run wct-test` should take care both for you, read more in `package.json`.

You will need `polymer-bridges` which is a submodule you can clone from: https://gerrit-review.googlesource.com/admin/repos/polymer-bridges

As polymer 3 no longer support `Polymer.importHref` anymore, this plugin still supports it through a custom implementation in `gr-editor.js`.

## Test plugin on Gerrit

1. Build the bundle locally with: `bazel build :codemirror_editor`
2. Serve your generated 'codemirror_editor.js' somewhere, you can put it under `gerrit/plugins/codemirror-editor/` folder and it will automatically served at `http://localhost:8081/plugins_/codemirror-editor/`
3. Use FE dev helper, https://gerrit.googlesource.com/gerrit-fe-dev-helper/, inject the local served 'codemirror_editor.js' to the page

If your plugin is already enabled, then you can block it and then inject the compiled local verison.

See more about how to use dev helper extension to help you test here: https://gerrit.googlesource.com/gerrit-fe-dev-helper/+/master
