(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);

    /* @ngInject */
    function Shell($timeout, config, logger, gettextCatalog) {
        var vm = this;

        vm.title = config.appTitle;
        vm.busyMessage = gettextCatalog.getString('Please wait') + ' ...';
        vm.isBusy = true;
        vm.showSplash = true;
        vm.tagline = {
            text: gettextCatalog.getString('Created by') + ' John Papa',
            link: 'http://twitter.com/john_papa'
        };

        activate();

        function activate() {
            logger.success(config.appTitle + ' ' + gettextCatalog.getString('loaded') + '!', null);
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                vm.showSplash = false;
            }, 1000);
        }
    }
})();
