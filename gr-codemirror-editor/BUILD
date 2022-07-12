load("//tools/js:eslint.bzl", "plugin_eslint")
load("//tools/bzl:js.bzl", "gerrit_js_bundle", "karma_test")
load("@npm//@bazel/typescript:index.bzl", "ts_config", "ts_project")

package_group(
    name = "visibility",
    packages = ["//plugins/codemirror-editor/..."],
)

package(default_visibility = [":visibility"])

ts_config(
    name = "tsconfig",
    src = "tsconfig.json",
    deps = [
        "//plugins:tsconfig-plugins-base.json",
    ],
)

ts_project(
    name = "codemirror-editor-ts",
    srcs = glob(
        ["**/*.ts"],
        exclude = ["**/*test*"],
    ),
    incremental = True,
    out_dir = "_bazel_ts_out",
    tsc = "//tools/node_tools:tsc-bin",
    tsconfig = ":tsconfig",
    deps = [
        "@plugins_npm//@gerritcodereview/typescript-api",
        "@plugins_npm//lit",
        "@plugins_npm//@codemirror/autocomplete",
        "@plugins_npm//@codemirror/commands",
        "@plugins_npm//@codemirror/lang-css",
        "@plugins_npm//@codemirror/lang-cpp",
        "@plugins_npm//@codemirror/lang-html",
        "@plugins_npm//@codemirror/lang-java",
        "@plugins_npm//@codemirror/lang-javascript",
        "@plugins_npm//@codemirror/lang-json",
        "@plugins_npm//@codemirror/lang-markdown",
        "@plugins_npm//@codemirror/lang-php",
        "@plugins_npm//@codemirror/lang-python",
        "@plugins_npm//@codemirror/lang-rust",
        "@plugins_npm//@codemirror/lang-sql",
        "@plugins_npm//@codemirror/lang-xml",
        "@plugins_npm//@codemirror/language",
        "@plugins_npm//@codemirror/language-data",
        "@plugins_npm//@codemirror/lint",
        "@plugins_npm//@codemirror/search",
        "@plugins_npm//@codemirror/state",
        "@plugins_npm//@codemirror/view",
        "@plugins_npm//cm6-theme-basic-light",
    ],
)

ts_project(
    name = "codemirror-editor-ts-tests",
    srcs = glob(["**/*.ts"]),
    incremental = True,
    out_dir = "_bazel_ts_out_tests",
    tsc = "//tools/node_tools:tsc-bin",
    tsconfig = ":tsconfig",
    deps = [
        "@plugins_npm//:node_modules",
        "@ui_dev_npm//:node_modules",
    ],
)

gerrit_js_bundle(
    name = "gr-codemirror-editor",
    srcs = [":codemirror-editor-ts"],
    entry_point = "_bazel_ts_out/plugin.js",
)

karma_test(
    name = "karma_test",
    srcs = ["karma_test.sh"],
    data = [":codemirror-editor-ts-tests"],
)

plugin_eslint()
