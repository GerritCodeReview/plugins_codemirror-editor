load("//tools/bzl:js.bzl", "vulcanize")

vulcanize(
    name = "codemirror-editor",
    srcs = ["editor.html"],
    app = "editor.html",
    split = False,
    visibility = ["//visibility:public"],
    deps = ["//lib/js:codemirror-minified"],
)
