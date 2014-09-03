/* Copyright 2014 Jack Wakefield
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Check whether the user can access the page on route change.
 * @param {Object} $rootScope The root scope.
 * @param {Object} $state The state service.
 * @param {CommunicationService} communicationService The communication service.
 * @param {AuthService} authService The authentication service.
 */
export function checkAccessState($rootScope, $state, communicationService,
        authService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams,
            fromState, fromParams) {
        if (!authService.canAccess(toState.data.access)) {
            event.preventDefault();

            if (authService.isLoggedIn) {
                $state.go('user.home');
            } else {
                $state.go('guest.signIn');
            }
        }
    });
}
