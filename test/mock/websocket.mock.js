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

import {SocketState} from 'components/socket/socket-factory';

export class MockWebSocket {
    constructor(url, protocols = '') {
        this._url = url;
        this._readyState = SocketState.Connecting;
        this.extensions = '';
        this.binaryType = '';
        this.protocol = protocols;
    }

    get readyState() {
        return this._readyState;
    }

    get url() {
        return this._url;
    }

    get bufferedAmount() {
        return 0;
    }

    close(code = 1000, reason = '') {
        this._readyState = SocketState.Closed;
        this._mockCallClose();
    }

    send(data) {

    }

    _mockReceive(message) {
        this._mockCallMessage({
            data: message
        });
    }

    _mockConnected() {
        this._readyState = SocketState.Connected;
        this._mockCallOpen();
    }

    _mockErrorConnecting() {
        this._mockCallError();
    }

    _mockCallOpen() {
        if (angular.isFunction(this.onopen)) {
            this.onopen.call(this);
        }
    }

    _mockCallClose() {
        if (angular.isFunction(this.onclose)) {
            this.onclose.call(this);
        }
    }

    _mockCallError() {
        if (angular.isFunction(this.onerror)) {
            this.onerror.call(this);
        }
    }

    _mockCallMessage(event = null) {
        if (angular.isFunction(this.onmessage)) {
            this.onmessage.call(this, event);
        }
    }
}
