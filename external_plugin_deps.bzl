load("//tools/bzl:js.bzl", "bower_archive")

def external_plugin_deps():
  bower_archive(
    name = "codemirror-minified",
    package = "Dominator008/codemirror-minified",
    version = "5.28.0",
    sha1 = "51ba8d9256c63ce95238253c5b2eb7d5b12d6ed3"
  )
