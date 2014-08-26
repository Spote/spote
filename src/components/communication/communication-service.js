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

import {communicationModule} from './communication';

export class CommunicationService {
    /**
     * Initialise the communication server.
     * @param {Object} $rootScope The scope of the root controller.
     * @param {Object} $log The log service.
     * @param {SocketFactory} socket The web socket.
     * @param {String} address The address to connect to.
     */
    constructor($rootScope, $log, socket, address) {
        /**
         * The root scope.
         * @type {Object}
         */
        this.$rootScope = $rootScope;

        /**
         * The $log service.
         * @type {Object}
         */
        this.$log = $log.getInstance(
            'components.communication.CommunicationService');

        /**
         * The daemon socket.
         * @type {SocketFactory}
         */
        this._socket = socket;

        /**
         * The daemon address.
         * @type {String}
         */
        this._address = address;

        socket.opened = angular.bind(this, this._onOpen);
        socket.closed = angular.bind(this, this._onClose);
        socket.error = angular.bind(this, this._onError);
        socket.message = angular.bind(this, this._onMessage);
    }

    /**
     * Whether the app is connected to the server.
     */
    get isConnected() {
        return this._socket.isConnected;
    }

    /**
     * Whether the app is connecting to the server.
     */
    get isConnecting() {
        return this._socket.isConnecting;
    }

    connect() {
        let address = this._address;
        this.$log.debug('Connecting to daemon (' + address + ')');

        if (this.isConnected || this.isConnecting) {
            this.$log.error('Can\'t connect (already connected)');
            return;
        }

        this._socket.connect(address);
    }

    /**
     * Callback for the socket open event.
     */
    _onOpen() {
        this.$rootScope.$broadcast(
            'components.CommunicationService.connected');
    }

    /**
     * Callback for the socket close event.
     */
    _onClose() {
        this.$rootScope.$broadcast(
            'components.CommunicationService.disconnected');
    }

    /**
     * Callback for the socket error event.
     */
    _onError() {
        this.$rootScope.$broadcast(
            'components.CommunicationService.error');
    }

    /**
     * Callback for the socket message event.
     */
    _onMessage(message) {
    }
}

communicationModule.service('communicationService', [
    '$rootScope',
    '$log',
    'socketFactory',
    'webSocketAddress',
    CommunicationService
]);
