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

import {SocketState} from 'src/components/socket/socket-factory';

describe('components.socket.SocketFactory', function() {
    var socket;

    beforeEach(module('components.socket'));

    beforeEach(inject((_socketFactory_) => {
        socket = _socketFactory_;

        spyOn(socket, '_createWebSocket').and.callFake(() => {
            socket._webSocket = {
                address: socket._address,
                readyState: SocketState.Connecting,
                close() {
                    this.readyState = SocketState.Closed;
                    this._callClose();
                },
                send: jasmine.createSpy('WebSocket.send'),
                _receive(message) {
                    this._callMessage({
                        data: message
                    });
                },
                _connected() {
                    this.readyState = SocketState.Connected;
                    this._callOpen();
                },
                _errorConnecting() {
                    this._callError();
                },
                _callOpen() {
                    if (angular.isFunction(this.onopen)) {
                        this.onopen.call(this);
                    }
                },
                _callClose() {
                    if (angular.isFunction(this.onclose)) {
                        this.onclose.call(this);
                    }
                },
                _callError() {
                    if (angular.isFunction(this.onerror)) {
                        this.onerror.call(this);
                    }
                },
                _callMessage(event = null) {
                    if (angular.isFunction(this.onmessage)) {
                        this.onmessage.call(this, event);
                    }
                }
            };
        });
    }));

    it('isn\'t null', () => {
        expect(socket).not.toBe(null);
    });

    it('isn\'t connecting by default', () => {
        expect(socket.isConnecting).toBe(false);
    });

    it('isn\'t connected by default', () => {
        expect(socket.isConnected).toBe(false);
    });

    it('isn\'t closing by default', () => {
        expect(socket.isClosing).toBe(false);
    });

    it('is closed by default', () => {
        expect(socket.isClosed).toBe(true);
    });

    it('won\'t connect while already connecting', () => {
        socket.connect("ws://localhost:1234");
        let result = socket.connect("ws://localhost:1234");
        expect(result).toBe(false);
    });

    it('won\'t connect when the address is a number', () => {
        let result = socket.connect(0);
        expect(result).toBe(false);
        expect(socket._webSocket).toBeUndefined();
    });

    it('won\'t connect when the address is a boolean', () => {
        let result = socket.connect(false);
        expect(result).toBe(false);
        expect(socket._webSocket).toBeUndefined();
    });

    it('won\'t connect when the address is an array', () => {
        let result = socket.connect([]);
        expect(result).toBe(false);
        expect(socket._webSocket).toBeUndefined();
    });

    it('won\'t connect when the address is an object', () => {
        let result = socket.connect({});
        expect(result).toBe(false);
        expect(socket._webSocket).toBeUndefined();
    });

    it('won\'t connect when the address is null', () => {
        let result = socket.connect(null);
        expect(result).toBe(false);
        expect(socket._webSocket).toBeUndefined();
    });

    it('won\'t connect when the address is undefined', () => {
        let result = socket.connect();
        expect(result).toBe(false);
        expect(socket._webSocket).toBeUndefined();
    });

    it('it is connecting after calling connect', () => {
        socket.connect('ws://localhost:1234/ws');
        expect(socket.isConnecting).toBe(true);
    });

    it('it is connected a while after connecting', () => {
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._connected();
        expect(socket.isConnected).toBe(true);
    });

    it('it is closed after disconnecting', () => {
        socket.connect('ws://localhost:1234/ws');
        socket.close();
        expect(socket.isClosed).toBe(true);
    });

    it('calls the opened callback after connecting', () => {
        let opened = jasmine.createSpy('opened');

        socket.opened = opened;
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._connected();

        expect(opened).toHaveBeenCalled();
    });

    it('calls the closed callback after disconnecting', () => {
        let closed = jasmine.createSpy('closed');

        socket.closed = closed;
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket.close();

        expect(closed).toHaveBeenCalled();
    });

    it('calls error after an error is received', () => {
        let error = jasmine.createSpy('error');

        socket.error = error;
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._errorConnecting();

        expect(error).toHaveBeenCalled();
    });

    it('calls message after a message is received', () => {
        const data = "test123";
        let message = jasmine.createSpy('message');

        socket.message = message;
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._receive(data);

        expect(message).toHaveBeenCalledWith({ data: data });
    });

    it('sends the data sent', () => {
        const data = "test123";

        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._connected();
        socket.send(data);

        expect(socket._webSocket.send).toHaveBeenCalledWith(data);
    });

    it('doesn\'t send the data when the data is undefined', () => {
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._connected();
        socket.send();

        expect(socket._webSocket.send).not.toHaveBeenCalled();
    });
});
