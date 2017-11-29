load("//tools/bzl:js.bzl", "vulcanize")
load("//tools/bzl:plugin.bzl", "gerrit_plugin")

gerrit_plugin(
    name = "codemirror-editor",
    srcs = ["java/com/googlesource/gerrit/plugins/codemirror/CodemirrorModule.java"],
    manifest_entries = [
        "Gerrit-PluginName: codemirror-editor",
        "Gerrit-Module: com.googlesource.gerrit.plugins.codemirror.CodemirrorModule",
    ],
    resource_jars = [":cm-static"],
)

genrule(
    name = "cm-static",
    srcs = [":cm"],
    outs = ["cm-static.jar"],
    cmd = " && ".join([
        "ROOT=$$PWD",
        "TMP=$$(mktemp -d || mktemp -d -t bazel-tmp)",
        "mkdir $$TMP/static",
        "cp -rp $(locations :cm) $$TMP/static",
        "cd $$TMP",
        "zip -Drq $$ROOT/$@ -g .",
    ]),
)

vulcanize(
    name = "cm",
    srcs = ["editor.html"],
    app = "editor.html",
    deps = ["//lib/js:codemirror-minified"],
)
