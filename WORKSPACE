workspace(name = "codemirror_editor")

load("//:bazlets.bzl", "load_bazlets")

load_bazlets(
    commit = "42bffc66c0e92753133e4cea2debe65abc359c4d",
    # local_path = "/home/<user>/projects/bazlets",
)

load("//tools/bzl:maven_jar.bzl", "GERRIT")
load("//tools/bzl:js.bzl", "npm_binary", "bower_archive")

npm_binary(
    name = "bower",
)

npm_binary(
    name = "vulcanize",
    repository = GERRIT,
)

npm_binary(
    name = "crisper",
    repository = GERRIT,
)

load("//:external_plugin_deps.bzl", "external_plugin_deps")

external_plugin_deps()
