(function () {
    'use strict';

    var diagnostics = {
        enable: true // default
    };

    angular
        .module('blocks.diagnostics')
        .constant('diagnostics', diagnostics)
        .config(bindingDecorator);

    /**
     * Add binding diaganostics to the console
     * @param  {Object} $provide
     * @ngInject
     */
    bindingDecorator.$inject = ['$provide'];

    function bindingDecorator($provide) {
        $provide.decorator('$interpolate', extendInterpolater);
    }

    /* @ngInject */
    extendInterpolater.$inject = ['$delegate', '$log', 'diagnostics'];

    function extendInterpolater($delegate, $log, diagnostics) {
        if (diagnostics.enable) {
            angular.extend(interpolatorWrapper, $delegate);
            return interpolatorWrapper;
        }
        return $delegate;

        ////////////////

        function interpolatorWrapper() {
            /* jshint validthis:true */
            var bindingFunction = $delegate.apply(this, arguments);
            var bindingExpression = arguments[0];
            if (angular.isFunction(bindingFunction) && bindingExpression) {
                return bindingWrapper(bindingFunction, bindingExpression.trim());
            }
            return bindingFunction;

            function bindingWrapper(bindingFunction, bindingExpression) {
                return bindingInspector;

                function bindingInspector() {
                    var result = bindingFunction.apply(this, arguments);
                    var trimmedResult = result.trim();
                    var log = trimmedResult ? $log.info : $log.warn;
                    var msg = 'Binding: ' +
                        bindingExpression + ' = ' + trimmedResult;
                    log.call($log, msg);
                    return result;
                }
            }
        }

    }
})();
