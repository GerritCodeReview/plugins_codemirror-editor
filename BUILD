load("//tools/bzl:genrule2.bzl", "genrule2")
load("//tools/bzl:js.bzl", "bundle_assets", "polygerrit_plugin")
load("//tools/bzl:plugin.bzl", "gerrit_plugin")

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
    name = "codemirror-element-shadowdom",
    srcs = [
        "gr-editor/codemirror-element.css",
        "gr-editor/codemirror-element.js",
        "gr-editor/codemirror-element-shadowdom.html",
    ],
    app = "gr-editor/codemirror-element-shadowdom.html",
    split = False,
    deps = ["//lib/js:codemirror-minified"],
)

bundle_assets(
    name = "codemirror-element-shadydom",
    srcs = [
        "gr-editor/codemirror-element.css",
        "gr-editor/codemirror-element.js",
        "gr-editor/codemirror-element-shadydom.html",
    ],
    app = "gr-editor/codemirror-element-shadydom.html",
    split = False,
    deps = ["//lib/js:codemirror-minified"],
)

polygerrit_plugin(
    name = "codemirror_editor",
    srcs = glob([
        "gr-editor/*.html",
        "gr-editor/*.js",
    ]),
    app = "plugin.html",
    assets = [
        ":codemirror-element-shadowdom",
        ":codemirror-element-shadydom",
    ],
)
