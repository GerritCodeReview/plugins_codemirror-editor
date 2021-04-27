load("//tools/bzl:genrule2.bzl", "genrule2")
load("//tools/bzl:js.bzl", "polygerrit_plugin")
load("//tools/bzl:plugin.bzl", "gerrit_plugin")

gerrit_plugin(
    name = "codemirror-editor",
    srcs = ["java/com/googlesource/gerrit/plugins/codemirror/CodemirrorModule.java"],
    manifest_entries = [
        "Gerrit-PluginName: codemirror-editor",
        "Gerrit-Module: com.googlesource.gerrit.plugins.codemirror.CodemirrorModule",
        "Implementation-Title: Codemirror Editor plugin",
    ],
    resource_jars = [":cm-static"],
)

genrule2(
    name = "cm-static",
    srcs = [
        ":codemirror-element",
        ":codemirror_editor",
    ],
    outs = ["cm-static.jar"],
    cmd = " && ".join([
        "mkdir $$TMP/static",
        "cp $(SRCS) $$TMP/static",
        "cd $$TMP",
        "zip -Drq $$ROOT/$@ -g .",
    ]),
)

#TODO(davido): Simplify this rule using npm_package_bin
genrule(
    name = "codemirror-element",
    srcs = [
        "gr-editor/codemirror-element.css",
        "gr-editor/codemirror-element.html",
        "gr-editor/codemirror-element.js",
        "@tools_npm//codemirror-minified",
    ],
    outs = ["codemirror-element.html"],
    cmd = " ".join([
        "p=$$PWD && ",
        "cd $(@D)/codemirror-element.sh.runfiles/gerrit/plugins/codemirror-editor && ",
        "ln -sf ../../external/tools_npm/node_modules/codemirror-minified . && ",
        "cd ../.. && ",
        "$$p/$(location @tools_npm//polymer-bundler/bin:polymer-bundler)",
        "--inline-scripts",
        "--inline-css",
        "--sourcemaps",
        "--strip-comments",
        "--root",
        "plugins/codemirror-editor",
        "--out-file",
        "$$p/$@",
        "/gr-editor/codemirror-element.html",
    ]),
    local = True,
    tools = ["@tools_npm//polymer-bundler/bin:polymer-bundler"],
)

polygerrit_plugin(
    name = "codemirror_editor",
    app = "gr-editor/gr-editor.js",
)
