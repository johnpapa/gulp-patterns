AngularPlus
===========

AngularPlus (ngplus) contains a set of helpers, directives and services for AngularJS, under MIT license. 

Version 0.9.0

Authors: John Papa and Dan Wahlin
  
Use, reproduction, distribution, and modification of this code is subject to the terms and conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 



#ngplusOverlay Directive

![ngplusOverlay Directive Example](https://raw.github.com/DanWahlin/AngularOverlay/master/content/images/appExample.png)

The ngplusOverlay directive intercepts $http and jQuery XHR calls and displays and overlay. To get started using it follows these steps:

1. Add the directive script located in scripts/ngplus-overlay.js into your project and reference the `ngplus` module:
2. Reference the `ngplus` module:

```javascript
angular.module('app', ['ngRoute', 'ngAnimate', 'ngplus']);
```

3. Add the following styles into a CSS stylesheet (tweak as needed):

```css
.ngplus-overlay-background {
    top: 0px;
    left: 0px;
    padding-left: 100px;
    position: absolute;
    z-index: 10000;
    height: 100%;
    width: 100%;
    background-color: #808080;
    opacity: 0.2;
}

.ngplus-overlay-content {
    position: absolute;
    /*border: 1px solid #000;*/
    /*background-color: #fff;*/
    font-weight: bold;
    height: 100px;
    width: 300px;
    height: 15em;
    width: 20em;
    z-index: 10000;
    text-align: center;
}

/*Optional Animations*/
.dissolve-animation.ng-hide-remove,
.dissolve-animation.ng-hide-add {
    display: inline !important;
    -webkit-transition: 0.5s linear all;
    -moz-transition: 0.5s linear all;
    -o-transition: 0.5s linear all;
    transition: 0.5s linear all;
}

    .dissolve-animation.ng-hide-remove.ng-hide-remove-active,
    .dissolve-animation.ng-hide-add {
        opacity: 1;
    }

        .dissolve-animation.ng-hide-add.ng-hide-add-active,
        .dissolve-animation.ng-hide-remove {
            opacity: 0;
        }

```

4. Add the directive into your main shell page:

```html
<div ngplus-overlay
     ngplus-overlay-delay-in="50"
     ngplus-overlay-delay-out="700"
     ngplus-overlay-animation="dissolve-animation">
    <img src="../../content/images/busy.gif"/>
 	  Optional loading message or HTML content goes here
</div>
```

Once you have the code locally, install [Node.js](http://nodejs.org), open a command-prompt and run:

```
node server.js
```

ngplusOverlay directive in action.

Note: This directive was created for a prototype project and has only been tested with Chrome and IE10+. It's intended to provide a starting point, evolve over time (please contribute!), and hopefully save someone some time.

###Options

- `ngplus-overlay-delay-in="50"` indicates the number of milliseconds to wait before showing the overlay. This is useful so we do not have a flicker for super short XHR. Default is 500 ms.
- `ngplus-overlay-delay-out="700"` indicates the number of milliseconds to keep the overlay around after the last XHR has completed. Default is 500 ms.
- `ngplus-overlay-animation="dissolve-animation"` indicates the CSS animation to apply. Must be an animation that supports the AngularJS standard for ngShow/ngHide. This is an optional setting. 

