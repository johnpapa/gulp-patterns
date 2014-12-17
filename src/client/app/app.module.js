(function() {

    'use strict';

    angular.module('app', [
        /* Shared modules */
        'app.core',
        'app.widgets',

        /* Feature areas */
        'app.customers',
        'app.dashboard',
        'app.layout'
    ]);

})();
