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

describe('AppController', function() {
    var $rootScope, controller;

    beforeEach(module('app'));
    beforeEach(inject((_$rootScope_, _$controller_, _$state_, _$window_,
            _$timeout_, _communicationService_) => {
        $rootScope = _$rootScope_;
        controller = _$controller_('AppController', {
            $scope: $rootScope,
            $state: _$state_,
            $window: _$window_,
            $timeout: _$timeout_,
            communicationService: _communicationService_
        });
    }));

    it('isn\'t null', () => {
        expect(controller).not.toBe(null);
    });
});
