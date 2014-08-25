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

export class AppController {
    /**
     * Initialise the app controller.
     * @param {Object} $scope The controller scope.
     * @param {Object} $state The state service.
     * @param {Object} $window The window service.
     * @param {Object} $timeout The timeout service.
     * @param {CommunicationService} communicationService The communication
     *  service.
     */
    constructor($scope, $state, $window, $timeout, communicationService) {
        this.$scope = $scope;
        this.$state = $state;
        this.$window = $window;
        this.$timeout = $timeout;

        this.$scope.$on('components.communicationService.disconnected',
            angular.bind(this, this._onDisconnect));

        if (!communicationService.isConnected &&
                !communicationService.isConnecting) {
            this._onDisconnect();
        }
    }

    /**
     * Callback for the communication disconnect event.
     */
    _onDisconnect() {
        this.$timeout(() => {
            this.$state.go('global.connecting');
        });
    }
}
