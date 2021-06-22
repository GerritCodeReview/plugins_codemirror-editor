load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")
load("//tools/bzl:genrule2.bzl", "genrule2")
load("//tools/bzl:js.bzl", "polygerrit_plugin")
load("//tools/bzl:plugin.bzl", "gerrit_plugin")

gerrit_plugin(
    name = "codemirror-editor",
    srcs = ["java/com/googlesource/gerrit/plugins/codemirror/CodemirrorModule.java"],
    manifest_entries = [
        "Gerrit-PluginName: codemirror-editor",
        "Gerrit-Module: com.googlesource.gerrit.plugins.codemirror.CodemirrorModule",
        "Implementation-Title: Codemirror Editor plugin",
    ],
    resource_jars = [":codemirror-editor-static"],
)

genrule2(
    name = "codemirror-editor-static",
    srcs = [":codemirror_editor"],
    outs = ["codemirror-editor-static.jar"],
    cmd = " && ".join([
        "mkdir $$TMP/static",
        "cp -r $(locations :codemirror_editor) $$TMP/static",
        "cd $$TMP",
        "zip -Drq $$ROOT/$@ -g .",
    ]),
)

polygerrit_plugin(
    name = "codemirror_editor",
    app = "codemirror-editor-bundle.js",
)

rollup_bundle(
    name = "codemirror-editor-bundle",
    srcs = glob([
        "**/*.js",
    ]) + ["@plugins_npm//:node_modules"],
    config_file = "rollup.config.js",
    entry_point = "plugin.js",
    format = "iife",
    rollup_bin = "//tools/node_tools:rollup-bin",
    sourcemap = "hidden",
    deps = [
        "@tools_npm//rollup-plugin-node-resolve",
    ],
)
