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
import {SocketState} from 'components/socket/socket-factory';

export class MockSocketFactory {
    constructor() {
        this._readyState = SocketState.Closed;
    }

    get isConnecting() {
        return this._readyState === SocketState.Connecting;
    }

    get isConnected() {
        return this._readyState === SocketState.Connected;
    }

    get isClosing() {
        return this._readyState === SocketState.Closing;
    }

    get isClosed() {
        return this._readyState === SocketState.Closed;
    }

    connect(address) {
        if (!angular.isString(address)) {
            return false;
        }

        // ensure we aren't already connecting or connected
        if (this.isConnecting || this.isConnected) {
            return false;
        }

        this._mockOpen();

        return true;
    }

    close() {
        this._mockClose();
    }

    send(data) {
    }

    _mockOpen(event) {
        this._readyState = SocketState.Connected;
        (this.opened || angular.noop)(event);
    }

    _mockClose(event) {
        this._readyState = SocketState.Closed;
        (this.closed || angular.noop)(event);
    }

    _mockError(event) {
        (this.error || angular.noop)(event);
    }

    _mockMessage(event) {
        (this.message || angular.noop)(event);
    }
}

socketModule.factory('socketFactory', () => new MockSocketFactory());
