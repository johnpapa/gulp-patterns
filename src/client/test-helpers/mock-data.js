/* jshint -W079 */
var mockData = (function() {
    return {
        getMockCustomers: getMockCustomers,
        getMockStates: getMockStates,
        blackWidow: getMockCustomers()[0]
    };

    function getMockStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/',
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }
        ];
    }

    function getMockCustomers() {
        return [
            {
                id: 1017109,
                firstName: 'Black',
                lastName: 'Widow',
                city: 'Albany',
                state: 'NY',
                zip: '12205',
                thumbnail: 'colleen_papa.jpg'
            },
            {
                id: 1017105,
                firstName: 'Tony',
                lastName: 'Stark',
                city: 'Loudonville',
                state: 'NY',
                zip: '12211',
                thumbnail: 'john_papa.jpg'
            },
            {
                id: 1017108,
                firstName: 'Clint',
                lastName: 'Barton',
                city: 'Bothell',
                state: 'WA',
                zip: '98012',
                thumbnail: 'ward_bell.jpg'
            },
            {
                id: 1017104,
                firstName: 'Steve',
                lastName: 'Rogers',
                city: 'Orlando',
                state: 'FL',
                zip: '33746',
                thumbnail: 'jesse_liberty.jpg'
            },
            {
                id: 1017106,
                firstName: 'Thor',
                lastName: 'of Asgard',
                city: 'Raleigh',
                state: 'NC',
                zip: '27601',
                thumbnail: 'jason_salmond.jpg'
            }
        ];
    }
})();
