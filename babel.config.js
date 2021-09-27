module.exports = (api) => {
  console.log('performing babel.config.js');
  api.cache(true);
  return {
    "env": {
      "development": {
        "plugins": [
          ["babel-plugin-root-import", {
            "functions": ["jest.mock", "import", "rootTransformed"],
            "paths": [
              {
                root: __dirname,
                "rootPathPrefix": "^/",
                "rootPathSuffix": "src"
              },
              {
                root: __dirname,
                "rootPathPrefix": "!/",
                "rootPathSuffix": ""
              },
              {
                root: __dirname,
                "rootPathPrefix": "?/",
                "rootPathSuffix": "tests"
              },
              {
                root: __dirname,
                "rootPathPrefix": "~/",
                "rootPathSuffix": "assets/images"
              },
              {
                root: __dirname,
                "rootPathPrefix": ">/",
                "rootPathSuffix": "src/Modules/Shipping"
              },
              {
                root: __dirname,
                "rootPathPrefix": "%/",
                "rootPathSuffix": "src/Modules"
              }
            ]
          }]
        ]
      }
    }
  }
}