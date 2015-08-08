# gulp-patterns
You've built your JavaScript application but how do you automate testing, code analysis, running it locally or deploying it? These redundant tasks can consume valuable time and resources. Stop working so hard and take advantage of JavaScript task automation using Gulp to streamline these tasks and give you back more time in the day. Studying this repo can help clarify how Gulp works, jump-start task automation with Gulp, find and resolve issues faster, and be a more productive.

[![Build Status](https://travis-ci.org/johnpapa/gulp-patterns.svg?branch=master)](https://travis-ci.org/johnpapa/gulp-patterns)

[![Codeship Status for johnpapa/gulp-patterns](https://codeship.io/projects/46913320-7139-0132-3214-62f5102d8589/status)](https://codeship.io/projects/54583)

## Requirements

- Install Node
    - on OSX install [home brew](http://brew.sh/) and type `brew install node`
    - on Windows install [chocolatey](https://chocolatey.org/)
        - More tips on [Windows with node](http://jpapa.me/winnode)
        - open command prompt as administrator
            - type `choco install nodejs`
            - type `choco install nodejs.install`
    - On OSX you can alleviate the need to run as sudo by [following these instructions](http://jpapa.me/nomoresudo). I highly recommend this step on OSX
- Open terminal
- Type `npm install -g node-inspector bower gulp tsd`

## Quick Start
Clone this repo and run the content locally
```bash
$ npm install
$ bower install
$ tsd install -r -o --save
$ gulp serve-dev
```

## Tasks

### Task Listing

- `gulp help`

    Displays all of the available gulp tasks.

### Code Analysis

- `gulp vet`

    Performs static code analysis on all javascript files. Runs jshint and jscs.

- `gulp vet --verbose`

    Displays all files affected and extended information about the code analysis.

- `gulp plato`

    Performs code analysis using plato on all javascript files. Plato generates a report in the reports folder.

### Testing

- `gulp serve-specs`

    Serves and browses to the spec runner html page and runs the unit tests in it. Injects any changes on the fly and re runs the tests. Quick and easy view of tests as an alternative to terminal via `gulp test`.

- `gulp test`

    Runs all unit tests using karma runner, mocha, chai and sinon with phantomjs. Depends on vet task, for code analysis.

- `gulp test --startServers`

    Runs all unit tests and midway tests. Cranks up a second node process to run a server for the midway tests to hit a web api.

- `gulp autotest`

    Runs a watch to run all unit tests.

- `gulp autotest --startServers`

    Runs a watch to run all unit tests and midway tests. Cranks up a second node process to run a server for the midway tests to hit a web api.

### Cleaning Up

- `gulp clean`

    Remove all files from the build and temp folders

- `gulp clean-images`

    Remove all images from the build folder

- `gulp clean-code`

    Remove all javascript and html from the build folder

- `gulp clean-fonts`

    Remove all fonts from the build folder

- `gulp clean-styles`

    Remove all styles from the build folder

### Fonts and Images

- `gulp fonts`

    Copy all fonts from source to the build folder

- `gulp images`

    Copy all images from source to the build folder

### Styles

- `gulp styles`

    Compile less files to CSS, add vendor prefixes, and copy to the build folder

### Bower Files

- `gulp wiredep`

    Looks up all bower components' main files and JavaScript source code, then adds them to the `index.html`.

    The `.bowerrc` file also runs this as a postinstall task whenever `bower install` is run.

### Angular HTML Templates

- `gulp templatecache`

    Create an Angular module that adds all HTML templates to Angular's $templateCache. This pre-fetches all HTML templates saving XHR calls for the HTML.

- `gulp templatecache --verbose`

    Displays all files affected by the task.

### Serving Development Code

- `gulp serve-dev`

    Serves the development code and launches it in a browser. The goal of building for development is to do it as fast as possible, to keep development moving efficiently. This task serves all code from the source folders and compiles less to css in a temp folder.

- `gulp serve-dev --nosync`

    Serves the development code without launching the browser.

- `gulp serve-dev --debug`

    Launch debugger with node-inspector.

- `gulp serve-dev --debug-brk`

    Launch debugger and break on 1st line with node-inspector.

- `gulp serve-dev --stubs`

    Serves the development code with the stubs to avoid hitting a real backend

### Building Production Code

- `gulp optimize`

    Optimize all javascript and styles, move to a build folder, and inject them into the new index.html

- `gulp build`

    Copies all fonts, copies images and runs `gulp optimize` to build the production code to the build folder.

### Serving Production Code

- `gulp serve-build`

    Serve the optimized code from the build folder and launch it in a browser.

- `gulp serve-build --nosync`

    Serve the optimized code from the build folder and manually launch the browser.

- `gulp serve-build --debug`

    Launch debugger with node-inspector.

- `gulp serve-build --debug-brk`

    Launch debugger and break on 1st line with node-inspector.
