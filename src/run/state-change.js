/* jshint esnext: true */

export default function stateChange($rootScope, $state, authService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams,
            fromState, fromParams) {
        if (authService.isLoggedIn != toState.data.access) {
            event.preventDefault();

            if (fromState.url === '^') {
                if (authService.isLoggedIn) {
                    $state.go('user.home');
                } else {
                    $state.go('guest.login');
                }
            }
        }
    });
}