# CodeMirror Editor

A plugin that uses CodeMirror to provide a rich code editing experience in PolyGerrit.

The plugins hooks into the `editor` endpoint and registers `gr-editor` for it.

The `codemirror-element` using CodeMirror is loaded lazily from another js bundle, because it is
fairly large, and we don't want to load the large bundle, if the user is not editing anything.

We are using the generic test target in the `plugins/` folder. See `plugins/BUILD` for how to
enable the tests and then run `bazel run plugins:web-test-runner`.

For testing you can use FE dev helper (https://gerrit.googlesource.com/gerrit-fe-dev-helper/). It
allows you to redirect to (symlinks to) your locally built files. You can use `npm run start` to
serve files and put the locally built files (or symlinks) in the `polygerrit-ui/app/` folder.
