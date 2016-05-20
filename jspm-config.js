System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": ".jspm_packages/github/*"
  },

  map: {
    "aframevr/aframe": "github:aframevr/aframe@master",
    "donmccurdy/aframe-extras": "github:donmccurdy/aframe-extras@1.15.1",
    "gasolin/aframe-href-component": "github:gasolin/aframe-href-component@master"
  }
});
