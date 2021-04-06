load("//tools/bzl:genrule2.bzl", "genrule2")
load("//tools/bzl:js.bzl", "bundle_assets", "polygerrit_plugin")
load("//tools/bzl:plugin.bzl", "gerrit_plugin")
load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")

gerrit_plugin(
    name = "codemirror-editor",
    srcs = ["java/com/googlesource/gerrit/plugins/codemirror/CodemirrorModule.java"],
    manifest_entries = [
        "Gerrit-PluginName: codemirror-editor",
        "Gerrit-Module: com.googlesource.gerrit.plugins.codemirror.CodemirrorModule",
        "Implementation-Title: Codemirror Editor plugin",
    ],
    resource_jars = [":cm-static"],
)

genrule2(
    name = "cm-static",
    srcs = [":codemirror_editor"],
    outs = ["cm-static.jar"],
    cmd = " && ".join([
        "mkdir $$TMP/static",
        "cp -r $(locations :codemirror_editor) $$TMP/static",
        "cd $$TMP",
        "zip -Drq $$ROOT/$@ -g .",
    ]),
)

bundle_assets(
    name = "codemirror-element",
    srcs = [
        "gr-editor/codemirror-element.css",
        "gr-editor/codemirror-element.html",
        "gr-editor/codemirror-element.js",
    ],
    app = "gr-editor/codemirror-element.html",
    split = False,
    deps = ["//lib/js:codemirror-minified"],
)

polygerrit_plugin(
    name = "codemirror_editor",
    app = "plugin-bundle.js",
    assets = [
        ":codemirror-element",
    ],
)

rollup_bundle(
    name = "plugin-bundle",
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
