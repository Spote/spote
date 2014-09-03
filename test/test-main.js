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

var allTestFiles = ['app'];
var TEST_REGEXP = /spec\.js$/;

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '../').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(pathToModule(file));
    }
});

requirejs.config({
    baseUrl: '/base/src/',
    paths: {
        'angular': '../bower_components/angular/angular',
        'angularAnimate': '../bower_components/angular-animate/angular-animate',
        'angularMocks': '../bower_components/angular-mocks/angular-mocks',
        'traceur': '../bower_components/traceur-runtime/traceur-runtime',
        'angularUiRouter': '../bower_components/angular-ui-router/release/angular-ui-router',
        'uiRouterExtras': '../bower_components/ui-router-extras/release/ct-ui-router-extras',
        'logEx': '../bower_components/angular-logex/dist/log-ex-unobtrusive'
    },
    shim: {
        'app': {
            deps: ['angular', 'angularAnimate', 'angularMocks', 'angularUiRouter',
                'uiRouterExtras', 'logEx'],
            exports: 'app'
        },
        'angularAnimate': {
            deps: ['angular'],
            exports: 'angularAnimate'
        },
        'angularMocks': {
            deps: ['angular'],
            exports: 'angularMocks'
        },
        'angularUiRouter': {
            deps: ['angular'],
            exports: 'angularUiRouter'
        },
        'uiRouterExtras': {
            deps: ['angular', 'angularUiRouter'],
            exports: 'uiRouterExtras'
        },
        'logEx': {
            deps: ['angular'],
            exports: 'logEx'
        },
        'esModuleLoader': {
            exports: 'esModuleLoader'
        },
        'systemJs': {
            deps: ['esModuleLoader'],
            exports: 'systemJs'
        }
    },
    deps: allTestFiles,
    callback: window.__karma__.start
});
