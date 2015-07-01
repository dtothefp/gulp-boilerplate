#### Gulp Boilerplate for linting (eslint), testing (mocha/nightmare/phantom), and JS compilation (webpack)

#### Getting Started
```
npm -g uninstall gulp --save
npm -g i gulp#3.9 // ensure the version is 3.9
npm i
gulp // runs dev build (lints files, starts webpack-dev-server, opens webpage at localhost:3001) with livereload for JS
gulp -e prod // runs prod build => uglifies JS
gulp mocha // while server is running in separate tab, runs all tests
gulp mocha -f something-spec // runs the test for test/**/something-spec.js
gulp test // must have server NOT running, runs all tests
```

#### TODO:
- add environmental specific eslint rules
- agree on useful eslint rules
- add Karma testing with Browserstack
- add React .jsx support
- probably lots of other stuff
