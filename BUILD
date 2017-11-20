load("//tools/bzl:plugin.bzl", "gerrit_plugin",)

gerrit_plugin(
    name = "codemirror-editor",
    srcs = glob(["src/main/java/**/*.java"]),
    manifest_entries = [
        "Gerrit-PluginName: codemirror-editor",
        "Gerrit-HttpModule: com.googlesource.gerrit.plugins.codemirroreditor.EditorHttpModule",
    ],
    resources = glob(["src/main/resources/**/*"]),
)
