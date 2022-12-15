load("//tools/bzl:plugin.bzl", "gerrit_plugin")

gerrit_plugin(
    name = "codemirror-editor",
    srcs = ["java/com/googlesource/gerrit/plugins/codemirror/CodemirrorModule.java"],
    manifest_entries = [
        "Gerrit-PluginName: codemirror-editor",
        "Gerrit-Module: com.googlesource.gerrit.plugins.codemirror.CodemirrorModule",
        "Implementation-Title: Codemirror Editor plugin",
    ],
    resource_jars = [
        "//plugins/codemirror-editor/web:codemirror-editor",
        "//plugins/codemirror-editor/web:codemirror-element",
    ],
)
