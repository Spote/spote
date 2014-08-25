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

import {connectingModule} from './connecting';

class ConnectingController {
    /**
     * Initialise the connecting controller.
     * @param {Object} $scope The controller scope.
     * @param {Object} $location The location service.
     * @param {Object} $previousState The previous state service.
     * @param {CommunicationService} communicationService The communication
     *  service.
     */
    constructor($scope, $location, $previousState, communicationService) {
        this.$scope = $scope;
        this.$location = $location;
        this.$previousState = $previousState;
        this.communicationService = communicationService;

        this.$scope.$on('components.communicationService.connected',
            angular.bind(this, this._onConnect));
    }

    /**
     * Callback for the communication service connection event.
     */
    _onConnect() {
        let previousState = this.$previousState.get();

        // check whether the previous state is abstract, in which case we can't
        // redirect back there, otherwise redirect to the previous state
        if (previousState.state.abstract) {
            this.$location.path('/');
        } else {
            this.$previousState.go();
        }
    }
}

connectingModule.controller('ConnectingController', [
    '$scope',
    '$location',
    '$previousState',
    'communicationService',
    ConnectingController
]);
