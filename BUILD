load("//tools/bzl:js.bzl", "vulcanize")
load("//tools/bzl:plugin.bzl", "gerrit_plugin")

# TODO(davido): Find a better way to rename the resources folder to static
genrule(
    name = "codemirror-editor",
    srcs = [
        ":codemirror-editor__base",
    ],
    outs = ["codemirror-editor.jar"],
    visibility = ["//plugins:__subpackages__"],
    cmd = " && ".join([
        "ROOT=$$PWD",
        "TMP=$$(mktemp -d || mktemp -d -t bazel-tmp)",
        "unzip -qd $$TMP $(location :codemirror-editor__base)",
        "mv $$TMP/codemirror-editor $$TMP/static",
	"cd $$TMP",
        "zip -Drq $$ROOT/$@ -g .",
    ]),
)

gerrit_plugin(
    name = "codemirror-editor",
    srcs = ["java/com/googlesource/gerrit/plugins/codemirror/CodemirrorModule.java"],
    manifest_entries = [
        "Gerrit-PluginName: codemirror-editor",
        "Gerrit-Module: com.googlesource.gerrit.plugins.codemirror.CodemirrorModule",
    ],
    resource_strip_prefix = "plugins",
    resources = [":cm"],
    target_suffix = "__base",
)

vulcanize(
    name = "cm",
    srcs = ["editor.html"],
    app = "editor.html",
    visibility = ["//visibility:public"],
    deps = ["//lib/js:codemirror-minified"],
)
