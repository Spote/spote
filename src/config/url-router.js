/* jshint esnext: true */

export default function configureUrlRouter($stateProvider, $urlRouterProvider,
        $locationProvider, accessState) {
    //$locationProvider.html5Mode(true);

    $stateProvider
        .state('guest', {
            abstract: true,
            template: "<ui-view />",
            data: {
                access: accessState.guest
            }
        })
        .state('guest.login', {
            url: '/login',
            templateUrl: 'guest/login/login.html',
            controller: 'LoginController'
        });

    $stateProvider
        .state('user', {
            abstract: true,
            template: "<ui-view />",
            data: {
                access: accessState.user
            }
        })
        .state('user.home', {
            url: '/',
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        });

    $urlRouterProvider.otherwise('/');
}