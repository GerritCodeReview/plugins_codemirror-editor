load("//tools/bzl:genrule2.bzl", "genrule2")
load("//tools/bzl:js.bzl", "polygerrit_plugin")
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
    # resources = glob(["src/main/**/*"]),
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

genrule(
    name = "codemirror-element",
    srcs = [
        "gr-editor/codemirror-element.css",
        "gr-editor/codemirror-element.html",
        "gr-editor/codemirror-element.js",
        "@ui_npm//codemirror-minified",
    ],
    outs = ["codemirror-element.html"],
    cmd = " ".join([
        "p=$$PWD &&",
        "mkdir $(@D)/destdir &&",
        "tar -cf - $(SRCS) | tar -C $(@D)/destdir -xf - &&",
        "cd $(@D)/destdir/plugins/codemirror-editor &&",
        "ln -s ../../external/ui_npm/node_modules . &&",
        "cd ../.. &&",
        "$$p/$(location @tools_npm//polymer-bundler/bin:polymer-bundler)",
        "--inline-scripts",
        "--inline-css",
        "--sourcemaps",
        "--strip-comments",
        "--root",
        "plugins/codemirror-editor",
        "--out-file",
        "$$p/$@",
        "/gr-editor/codemirror-element.html &&",
        "rm -rf $(@D)/destdir",
    ]),
    tools = ["@tools_npm//polymer-bundler/bin:polymer-bundler"],
)

polygerrit_plugin(
    name = "codemirror_editor",
    app = "plugin-bundle.js",
)

rollup_bundle(
    name = "plugin-bundle",
    srcs = glob([
        "**/*.js",
    ]) + ["@ui_npm//codemirror-minified"],
    config_file = "rollup.config.js",
    entry_point = "gr-editor/gr-editor.js",
    format = "iife",
    rollup_bin = "//tools/node_tools:rollup-bin",
    sourcemap = "hidden",
    deps = [
        "@tools_npm//rollup-plugin-node-resolve",
        "@tools_npm//rollup-plugin-styles",
    ],
)
