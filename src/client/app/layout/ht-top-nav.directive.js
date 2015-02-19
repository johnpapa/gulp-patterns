(function() {
    'use strict';

    angular
        .module('app.layout')
        .directive('htTopNav', htTopNav);

    /* @ngInject */
    function htTopNav () {
        var directive = {
            bindToController: true,
            controller: TopNavController,
            controllerAs: 'vm',
            restrict: 'EA',
            scope: {
                'tagline': '=',
                'title': '='
            },
            templateUrl: 'app/layout/ht-top-nav.html'
        };

        /* @ngInject */
        function TopNavController(config, gettextCatalog, logger) {
            var vm = this;

            vm.baseAppPath = config.baseAppPath;
            vm.locale = {
                us:gettextCatalog.getString('English'),
                es:gettextCatalog.getString('Spanish')
            };
            vm.currentLocale = vm.locale.us;

            vm.switchLanguage  = switchLanguage;

            ////////////////////////

            function switchLanguage (lang) {

                if (lang === 'es') {
                    vm.currentLocale = vm.locale.es;
                } else {
                    vm.currentLocale = vm.locale.us;
                }

                if (gettextCatalog.getCurrentLanguage() !== lang) {
                    gettextCatalog.setCurrentLanguage(lang);
                    gettextCatalog.loadRemote(config.baseAppPath + '/languages/' + lang + '.json');
                    logger.info('Translation Loaded (' + lang + ')');
                }

                //Highlighting untranslated strings
                //You can enable a debugging mode to clearly indicate untranslated strings:
                //gettextCatalog.debug = true;
            }
        }

        return directive;
    }
})();
