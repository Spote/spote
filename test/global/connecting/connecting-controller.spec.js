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

import 'app';
import 'global/connecting/connecting';
import '../../mock/components/socket/socket-factory.mock';

describe('global.connecting.ConnectingController', function() {
    const WEB_SOCKET_ADDRESS = 'ws://localhost:51852/ws';
    var $rootScope, controller;

    beforeEach(module('global.connecting'));
    beforeEach(module('mock.components.socket'));
    beforeEach(module(($provide) => {
        $provide.constant('webSocketAddress', WEB_SOCKET_ADDRESS);
    }));

    beforeEach(inject((_$rootScope_, _$controller_, _$location_,
            _$previousState_, _communicationService_) => {
        $rootScope = _$rootScope_;
        controller = _$controller_('ConnectingController', {
            $scope: $rootScope,
            $location: _$location_,
            $previousState_: _$previousState_,
            communicationService: _communicationService_
        });
    }));

    it('isn\'t null', () => {
        expect(controller).not.toBe(null);
    });
});
