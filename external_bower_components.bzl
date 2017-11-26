load("//tools/bzl:js.bzl", "bower_component")

def external_bower_components():
  bower_component(
    name = "codemirror-minified",
  )
