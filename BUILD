load("//tools/bzl:js.bzl", "polygerrit_plugin")

polygerrit_plugin(
    name = "codemirror-editor",
    srcs = ["editor.html"],
    app = "editor.html",
    split = False,
    visibility = ["//visibility:public"],
    deps = ["//lib/js:codemirror-minified"],
)
