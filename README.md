# CodeMirror Editor

A plugin that uses CodeMirror to provide a rich code editing experience in PolyGerrit.

## UI plugin

This plugin is rewritten into Polymer 3 syntax. The `gr-editor.js` is the main entry for the plugin.

But to support the lazy load on the `codemirror` with supported languages, we still have the `codemirror-element.html` as an asset which still built separately as an html.

We may consider drop the selectively language support and in favor of all-in-one bundle in the future or change build rule to support bundle `css` in `js` to move off of the html completely.

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
