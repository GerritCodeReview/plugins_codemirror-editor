load("//tools/bzl:genrule2.bzl", "genrule2")
load("//tools/bzl:js.bzl", "polygerrit_plugin", "vulcanize")
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
    srcs = [":cm", ":cm-dep"],
    outs = ["cm-static.jar"],
    cmd = " && ".join([
        "mkdir $$TMP/static",
        "cp -rp $(locations :cm) $$TMP/static",
        "cp -rp $(locations :cm-dep) $$TMP/static",
        "mv $$TMP/static/cm-dep.html $$TMP/static/codemirror-assets.html",
        "cd $$TMP",
        "zip -Drq $$ROOT/$@ -g .",
    ]),
)

polygerrit_plugin(
    name = "codemirror_editor",
    srcs = glob(["gr-editor/*.html", "gr-editor/*.js"]),
    app = "plugin.html",
    assets = [":codemirror-assets"],
)

vulcanize(
    name = "codemirror-assets",
    srcs = glob(['gr-editor/codemirror-assets.html']),
    app = "gr-editor/codemirror-assets.html",
    deps = ["//lib/js:codemirror-minified"],
    split = False,
)
