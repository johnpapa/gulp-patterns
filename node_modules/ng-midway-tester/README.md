# ngMidwayTester [![Build Status](https://travis-ci.org/yearofmoo/ngMidwayTester.png?branch=master)](https://travis-ci.org/yearofmoo/ngMidwayTester)

A pure-javascript integration tester for AngularJS that can be run inline with application code.  

## Installation

1. run `npm install ng-midway-tester`.
2. include `./node_modules/ngMidwayTester/src/ngMidwayTester.js` into your test runner.

## Getting Started

Inside of your test spec code, you can use the midway tester like so:

```javascript
//creating the tester
var tester = ngMidwayTester('moduleName', { /* options */ });

//destroying the tester
tester.destroy();
tester = null;
```

Be sure to have a new instance of the tester for each spec you're testing.

## Example

```javascript
//this is the module code
angular.module('myModule', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider.when('/home', {
      template : 'welcome to {{ title }}',
      controller : 'HomeCtrl'
    });
  })
  .controller('HomeCtrl', function($scope) {
    $scope.title = 'my home page';
  });

//this test spec uses mocha since it has nice support for async testing...
describe('my test spec', function() {
  var tester;
  beforeEach(function() {
    tester = ngMidwayTester('myModule');
  });

  afterEach(function() {
    tester.destroy();
    tester = null;
  });

  it('should have a working home page', function(done) {
    tester.visit('/home', function() {
      expect(tester.path()).to.equal('/home');
      expect(tester.viewElement().html()).to.contain('welcome to my home page');

      var scope = tester.viewScope();
      expect(scope.title).to.equal('my home page');
      done();
    });
  });
});
```

## Downloading Assets

The benefit to using the midway tester is that it will act like an AngularJS application and work around asset mocking.
This means that if your code contains a remote XHR call to an asset file then the midway tester will download it just as normal.
However, due to the mechanics of Karma, you'll need to assign a **proxy** which assigns the root path to point to a server
hosting your website. 

In your Karma settings, it should look something like this:

```javascript
proxies: {
  //point this to the root of where your AngularJS application
  //is being hosted locally
  '/': 'http://localhost:8844/app'
}
```

When you start your test runner be sure to have the other server (in this case localhost:8844) running in the background.
This can be easily handled in the same terminal window using `grunt-contrib-connect` and setting `keepAlive:false`).

## Setting the index.html file

Just like an AngularJS application, your test runner expects to have an index.html file.
However simply using the same index.html provided in your application code will not work since
the JavaScript dependencies are loaded via karma. Therefore to get this to function properly,
you need to specify your own HTML to act as the index.html layout code for the test page. This
can be accomplished in two ways: using raw HTML directly or referencing a remote HTML file.

### Raw HTML
Instantiate the tester using the configuration object using `template`:

```javascript
var tester = ngMidwayTester('myApp', {
  template : '<div>' +
             '  <h1>hello</h1>' +
             '  <div id="view-container">' +
             '    <div ng-view></div>' +
             '  </div>' +
             '</div>'
});
```

### Remote HTML Template File
Instantiate the tester using the configuration object using `templateUrl`:

```javascript
var tester = ngMidwayTester('myApp', {
  templateUrl : '/test/test-index-template.html'
});
```

In order to make remote assets work with Karma as expected, you will need to setup a **proxy**
which points the root path to a server pointing it's root to your application directory. This
is explained in the previous section in the README.

### Default HTML Template Code

The default HTML code for the midway tester looks as follows:

```html
<div><div ng-view></div></div>
```

This will be used if a configuration object is not provided or either the template properties are not set.

## Docs

http://yearofmoo.github.io/ngMidwayTester/docs/classes/ngMidwayTester.html

## License

MIT
