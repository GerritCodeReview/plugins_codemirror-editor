load("//tools/bzl:js.bzl", "vulcanize")

vulcanize(
    name = "cm",
    srcs = glob(["**/*.html", "**/*.js"]),
    app = "plugin.html",
    deps = ["//lib/js:codemirror-minified"],
)
