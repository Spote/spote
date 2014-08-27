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

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine', 'traceur', 'requirejs'],
        files: [
            { pattern: 'bower_components/angular/angular.js', included: false },
            { pattern: 'bower_components/angular-animate/angular-animate.js', included: false },
            { pattern: 'bower_components/angular-mocks/angular-mocks.js', included: false },
            { pattern: 'bower_components/traceur-runtime/traceur-runtime.js', included: false },
            { pattern: 'bower_components/angular-ui-router/release/angular-ui-router.js', included: false },
            { pattern: 'bower_components/ui-router-extras/release/ct-ui-router-extras.js', included: false },
            { pattern: 'bower_components/angular-logex/dist/log-ex-unobtrusive.js', included: false },
            { pattern: 'bower_components/es6-module-loader/dist/es6-module-loader.js', included: false },
            { pattern: 'bower_components/system.js/dist/system.js', included: false },
            { pattern: 'src/*.js', included: false },
            { pattern: 'src/**/*.js', included: false },
            { pattern: 'test/**/*.spec.js', included: false },
            { pattern: 'test/**/*.mock.js', included: false },
            'test/test-main.js'
        ],
        preprocessors: {
            'src/**/*.js': ['traceur', 'coverage'],
            'test/**/*.spec.js': ['traceur'],
            'test/**/*.mock.js': ['traceur']
        },
        reporters: ['dots', 'coverage', 'coveralls'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['Firefox', 'Chrome'],
        captureTimeout: 60000,
        singleRun: true,
        traceurPreprocessor: {
            options: {
                experimental: true,
                sourceMaps: false,
                modules: 'amd'
            }
        },
        coverageReporter: {
            reporters: [
                {
                    type: 'lcov',
                    dir: 'coverage/'
                }
            ]
        }
    });
};
