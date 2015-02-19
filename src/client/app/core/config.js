(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[GulpPatterns Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Gulp Patterns Demo',
        imageBasePath: getValue('@@imageBasePath', '/images/photos/'),
        unknownPersonImageSource: 'unknown_person.jpg',
        baseAppPath: getValue('@@rootAppPath', ''),
        services : {
            customerApiUrl : getValue('@@customerApiUrl', '/api/customer/'),
            customersApiUrl : getValue('@@customersApiUrl', '/api/customers')
        }
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$compileProvider', '$logProvider',
         'diagnostics', 'exceptionHandlerProvider', 'routerHelperProvider'];
    /* @ngInject */
    function configure ($compileProvider, $logProvider,
         diagnostics, exceptionHandlerProvider, routerHelperProvider) {

        diagnostics.enable = false;

        $compileProvider.debugInfoEnabled(false);

        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        configureStateHelper();

        ////////////////

        function configureStateHelper() {
            var resolveAlways = { /* @ngInject */
                ready: function(dataservice) {
                    return dataservice.ready();
                }
            };

            routerHelperProvider.configure({
                docTitle: 'Gulp: ',
                resolveAlways: resolveAlways
            });
        }
    }

    /*gets a value from a replace tag. if the tag is not a value, it uses the default value*/
    function getValue(tag, defaultvalue) {
        if (tag.indexOf('@@') === 0) {
            return defaultvalue;
        } else {
            return tag;
        }
    }

})();
