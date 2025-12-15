load("@gerrit_api_version//:version.bzl", "GERRIT_API_VERSION")
load("@com_googlesource_gerrit_bazlets//:gerrit_plugin.bzl", "gerrit_plugin")

# We only need this target (which builds a jar), because we are serving 2 js
# bundles. Otherwise a `gerrit_js_bundle` would have been sufficient.
gerrit_plugin(
    name = "codemirror-editor",
    srcs = ["java/com/googlesource/gerrit/plugins/codemirror/CodemirrorModule.java"],
    gerrit_api_version = GERRIT_API_VERSION,
    manifest_entries = [
        "Gerrit-PluginName: codemirror-editor",
        "Gerrit-Module: com.googlesource.gerrit.plugins.codemirror.CodemirrorModule",
        "Implementation-Title: Codemirror Editor plugin",
    ],
    resource_jars = [
        "//plugins/codemirror-editor/web:codemirror_editor",
        "//plugins/codemirror-editor/web:codemirror_element",
    ],
)
