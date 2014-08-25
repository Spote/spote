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

import {AccessState} from '../components/auth/auth-service';

/**
 * Configures the URL router.
 * @param {Object} $stateProvider The state provider.
 * @param {Object} $urlRouterProvider The URL router provider.
 * @param {Object} $locationProvider The location provider.
 */
export function configureUrlRouter($stateProvider, $urlRouterProvider,
        $locationProvider) {
    // use the HTML5 History API for URLs
    $locationProvider.html5Mode(true);

    // configure the routes all users can access
    $stateProvider
        .state('global', {
            abstract: true,
            template: '<ui-view />',
            data: {
                access: AccessState.All
            }
        })
        .state('global.connecting', {
            title: 'Connecting',
            url: '/connecting',
            templateUrl: 'global/connecting/connecting.html',
            controller: 'ConnectingController'
        });

    // configure the routes only users who are not logged into Spotify can
    // access
    $stateProvider
        .state('guest', {
            abstract: true,
            template: '<ui-view />',
            data: {
                access: AccessState.Guest
            }
        })
        .state('guest.signIn', {
            title: 'Sign In',
            url: '/sign-in',
            templateUrl: 'guest/sign-in/sign-in.html',
            controller: 'SignInController'
        });

    // configure the routes only users who are logged into Spotify can access
    $stateProvider
        .state('user', {
            abstract: true,
            template: '<ui-view />',
            data: {
                access: AccessState.User
            }
        })
        .state('user.home', {
            url: '/',
            templateUrl: 'home/home.html',
            controller: 'HomeController'
        });

    $urlRouterProvider.otherwise('/');
}
