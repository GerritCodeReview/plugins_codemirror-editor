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
    resource_jars = [":cm-static"],
)

genrule2(
    name = "cm-static",
    srcs = [":cm"],
    outs = ["cm-static.jar"],
    cmd = " && ".join([
        "mkdir $$TMP/static",
        "cp -rp $(locations :cm) $$TMP/static",
        "cd $$TMP",
        "zip -Drq $$ROOT/$@ -g .",
    ]),
)

polygerrit_plugin(
    name = "cm",
    srcs = glob(["**/*.html", "**/*.js"]),
    app = "plugin.html",
    deps = [
        "//lib/js:google-diff-match-patch",
        "//lib/js:codemirror-minified",
    ],
)
