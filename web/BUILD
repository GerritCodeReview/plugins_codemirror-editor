load("//tools/js:eslint.bzl", "plugin_eslint")
load("//tools/bzl:js.bzl", "gerrit_js_bundle")
load("@npm//@bazel/typescript:index.bzl", "ts_config", "ts_project")

package_group(
    name = "visibility",
    packages = [
        "//plugins",
        "//plugins/codemirror-editor/...",
    ],
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
        ["*.ts"],
        exclude = ["**/*test*"],
    ),
    incremental = True,
    out_dir = "_bazel_ts_out",
    tsc = "//tools/node_tools:tsc-bin",
    tsconfig = ":tsconfig",
    deps = [
        "@plugins_npm//@gerritcodereview/typescript-api",
        "@plugins_npm//@types/codemirror",
        "@plugins_npm//lit",
    ],
)

gerrit_js_bundle(
    name = "codemirror_editor",
    srcs = [":codemirror-editor-ts"],
    entry_point = "_bazel_ts_out/plugin.js",
)

ts_project(
    name = "codemirror-element-ts",
    srcs = glob(
        ["element/*.ts"],
        exclude = ["**/*test*"],
    ),
    incremental = True,
    out_dir = "_bazel_ts_out",
    tsc = "//tools/node_tools:tsc-bin",
    tsconfig = ":tsconfig",
    deps = [
        "@plugins_npm//@gerritcodereview/typescript-api",
        "@plugins_npm//@types/codemirror",
        "@plugins_npm//codemirror",
        "@plugins_npm//lit",
    ],
)

gerrit_js_bundle(
    name = "codemirror_element",
    srcs = [":codemirror-element-ts"],
    entry_point = "_bazel_ts_out/element/entry-point.js",
)

# These are the test sources for the web-test-runner test in plugins/BUILD.
# Run the tests with `bazel test plugins:web-test-runner`.
filegroup(
    name = "codemirror-test-sources",
    srcs = glob(
        [
            "**/*.ts",
            "**/tsconfig.json",
        ],
    ),
)

# Run the lint tests with `bazel test plugins/codemirror-editor/web:lint_test`.
plugin_eslint()
