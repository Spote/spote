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

import {socketModule} from './socket';

/**
 * The milliseconds between each connection attempt.
 * @type {Number}
 */
const retryInterval = 100;

/**
 * The WebSocket states.
 * @type {Object}
 */
export const SocketState = {
    /**
     * The WebSocket is connecting.
     * @type {Number}
     */
    Connecting: 0,

    /**
     * The WebSocket is connected.
     * @type {Number}
     */
    Connected: 1,

    /**
     * The WebSocket is closing.
     * @type {Number}
     */
    Closing: 2,

    /**
     * The WebSocket is closed.
     * @type {Number}
     */
    Closed: 3
};

/**
 * A factory abstracting a WebSocket.
 */
export class SocketFactory {
    /**
     * Initialises the socket factory.
     * @param {$log} $log The $log service.
     * @param {$interval} $interval The $interval service.
     */
    constructor($log, $interval) {
        /**
         * The $log service.
         * @type {$log}
         */
        this.$log = $log;

        /**
         * The $interval service.
         * @type {$interval}
         */
        this.$interval = $interval;

        /**
         * Determines whether the connection was manually closed.
         * @type {Boolean}
         */
        this._forceClosed = false;
    }

    /**
     * Whether the value indicating whether the WebSocket state matches that
     *  specified.
     * @param  {Number} state The connection state to test against.
     * @return {Boolean} Whether the WebSocket state matches.
     */
    _isState(state) {
        let webSocket = this._webSocket;
        return angular.isDefined(webSocket) && webSocket.readyState === state;
    }

    /**
     * A value indicating whether the WebSocket is connecting.
     * @return {Boolean} Whether the WebSocket is connecting.
     */
    get isConnecting() {
        return this._isState(SocketState.Connecting);
    }

    /**
     * A value indicating whether the WebSocket is connected.
     * @return {Boolean} Whether the WebSocket is connected.
     */
    get isConnected() {
        return this._isState(SocketState.Connected);
    }

    /**
     * A value indicating whether the WebSocket is closing.
     * @return {Boolean} Whether the WebSocket is closing.
     */
    get isClosing() {
        return this._isState(SocketState.Closing);
    }

    /**
     * A value indicating whether the WebSocket is closed.
     * @return {Boolean} Whether the WebSocket is closed.
     */
    get isClosed() {
        return !angular.isDefined(this._webSocket) ||
            this._isState(SocketState.Closed);
    }

    /**
     * Begin the connection process.
     */
    _beginConnect() {
        this.$log.debug('Beginning connection process');

        // ensure the connect interval doesn't already exist
        if (angular.isDefined(this._connectInterval)) {
            this.$log.error('Stopped connection process (already running)');
            return;
        }

        // create the interval to attempt to connect to the WebSocket every
        // [retryInterval] milliseconds
        this._connectInterval = this.$interval(
            angular.bind(this, this._connect), retryInterval);

        // connect before the first interval
        this._connect();
    }

    /**
     * Create and connect to the WebSocket.
     */
    _connect() {
        // ensure we aren't already connecting or connected
        if (this.isConnecting || this.isConnected) {
            return;
        }

        let address = this._address;

        // ensure an address to connect to has been specified
        if (!angular.isString(address)) {
            this.$log.error('Stopping connection process (invalid address)');
            this._endConnect();

            return;
        }

        // create the WebSocket targetting the address specified in connect()
        // and setup the callbacks
        this._createWebSocket();
        this._bindWebSocket();
    }

    /**
     * End the connection process.
     */
    _endConnect() {
        this.$log.debug('Ending connection process');

        let connectInterval = this._connectInterval;

        // ensure a connect interval has been created
        if (!angular.isDefined(connectInterval)) {
            this.$log.error('Ending connection process');
            return;
        }

        this.$interval.cancel(connectInterval);
        this._connectInterval = undefined;
    }

    /**
     * Connect the WebSocket to the specified address.
     * @param  {String} address The address to connect to.
     * @return {Boolean} Whther the connection attempt was made.
     */
    connect(address) {
        if (!angular.isString(address)) {
            this.$log.error('Cannot connect (invalid address)');
            return false;
        }

        // ensure we aren't already connecting or connected
        if (this.isConnecting || this.isConnected) {
            this.$log.error('Cannot connect (already connected)');
            return false;
        }

        this._address = address;
        this._beginConnect();

        return true;
    }

    /**
     * Close the WebSocket connection.
     */
    close() {
        let socket = this._webSocket;

        if (!angular.isDefined(socket) || this.isClosing || this.isClosed) {
            this.$log.error('Cannot close connection (not connected)');
            return;
        }

        this.$log.debug('Closing connection');
        socket.close();
    }

    /**
     * Send the specified data to the WebSocket endpoint.
     * @param {String} data The data to send.
     */
    send(data) {
        if (!angular.isString(data)) {
            this.$log.error('Cannot send data (invalid data type)');
            return;
        }

        if (!this.isConnected) {
            this.$log.error('Cannot send data (not connected)');
            return;
        }

        this._webSocket.send(data);
    }

    /**
     * The callback function for the WebSocket.onopen event.
     * @param {Object} event The event object.
     */
    _onOpen(event) {
        let openedCallback = this.opened;
        this.$log.debug('Connection opened');

        // end the connection process
        this._endConnect();

        // invoke the opened callback if it's deemed valid
        if (angular.isFunction(openedCallback)) {
            openedCallback.call(this, event);
        }
    }

    /**
     * The callback function for the WebSocket.onclose event.
     * @param {Object} event The event object.
     */
    _onClose(event) {
        let closedCallback = this.closed;
        this.$log.debug('Connection closed');

        // clear the WebSocket and begin the reconnect attempt
        this._webSocket = undefined;

        if (!this._forceClosed) {
            this.$log.debug('Reconnecting');
            this._beginConnect();
        } else {
            this._forceClosed = false;
        }

        // invoke the closed callback if it's deemed valid
        if (angular.isFunction(closedCallback)) {
            closedCallback.call(this, event);
        }
    }

    /**
     * The callback function for the WebSocket.onerror event.
     * @param {Object} event The event object.
     */
    _onError(event) {
        let errorCallback = this.error;
        this.$log.debug('Connection error');

        // invoke the error callback if it's deemed valid
        if (angular.isFunction(errorCallback)) {
            errorCallback.call(this, event);
        }
    }

    /**
     * The callback function for the WebSocket.onmessage event.
     * @param {Object} event The event object.
     */
    _onMessage(event) {
        let messageCallback = this.message;

        // invoke the message callback if it's deemed valid
        if (angular.isFunction(messageCallback)) {
            messageCallback.call(this, event);
        }
    }

    /**
     * Create the WebSocket.
     */
    _createWebSocket() {
        this._webSocket = new WebSocket(this._address);
    }

    /**
     * Bind the WebSocket events.
     */
    _bindWebSocket() {
        if (!angular.isDefined(this._webSocket)) {
            this.$log.debug('Cannot bind WebSocket (undefined)');
            return;
        }

        let socket = this._webSocket;
        socket.onopen = angular.bind(this, this._onOpen);
        socket.onclose = angular.bind(this, this._onClose);
        socket.onerror = angular.bind(this, this._onError);
        socket.onmessage = angular.bind(this, this._onMessage);
    }
}

socketModule.factory('socketFactory', ['$log', '$interval',
    ($log, $interval) => new SocketFactory($log, $interval)]);
