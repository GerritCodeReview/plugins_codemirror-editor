Build
=====

This plugin is built using Bazel.
Only the Gerrit in-tree build is supported.

Clone or link this plugin to the plugins directory of Gerrit's source
tree.

```
  git clone https://gerrit.googlesource.com/gerrit
  git clone https://gerrit.googlesource.com/plugins/codemirror-editor
  cd gerrit/plugins
  ln -s ../../codemirror-editor .
```

From Gerrit source tree issue the command:

```
  bazel build plugins/codemirror-editor
```

The output is created in

```
  bazel-genfiles/plugins/codemirror-editor/codemirror-editor.jar
```
