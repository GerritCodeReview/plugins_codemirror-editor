load("//tools/bzl:js.bzl", "polygerrit_plugin")

polygerrit_plugin(
    name = "cm",
    srcs = glob(["**/*.html", "**/*.js"]),
    app = "plugin.html",
    deps = ["//lib/js:codemirror-minified"],
)
