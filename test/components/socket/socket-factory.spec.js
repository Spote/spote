/* Copyright 2014 Jack Wakefield
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {MockWebSocket} from '../../mock/websocket.mock';

describe('components.socket.SocketFactory', function() {
    var socket;

    beforeEach(module('components.socket'));

    beforeEach(inject((_socketFactory_) => {
        socket = _socketFactory_;

        spyOn(socket, '_createWebSocket').and.callFake(() => {
            socket._webSocket = new MockWebSocket(socket._address);
            spyOn(socket._webSocket, 'send').and.callThrough();
            spyOn(socket._webSocket, 'close').and.callThrough();
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
        socket.connect('ws://localhost:1234');
        let result = socket.connect('ws://localhost:1234');
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

    it('creates a WebSocket', () => {
        socket._createWebSocket();
        expect(socket._webSocket).not.toBe(null);
    });

    it('it is connecting after calling connect', () => {
        socket.connect('ws://localhost:1234/ws');
        expect(socket.isConnecting).toBe(true);
    });

    it('it is connected a while after connecting', () => {
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._mockConnected();
        expect(socket.isConnected).toBe(true);
    });

    it('it is closed after disconnecting', () => {
        socket.connect('ws://localhost:1234/ws');
        socket.close();
        expect(socket.isClosed).toBe(true);
    });

    it('should be force closed when calling close', () => {
        var result;

        socket.closed = () => {
            result = socket._forceClosed;
        };

        socket.connect('ws://localhost:1234/ws');
        socket.close();

        expect(result).toBe(true);
    });

    it('it doesn\'t close when closing', () => {
        socket.close();
        expect(socket._forceClosed).toBe(false);
    });

    it('it doesn\'t close when not connected', () => {
        socket.close();
        expect(socket._forceClosed).toBe(false);
    });

    it('calls the opened callback after connecting', () => {
        let opened = jasmine.createSpy('opened');

        socket.opened = opened;
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._mockConnected();

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
        socket._webSocket._mockErrorConnecting();

        expect(error).toHaveBeenCalled();
    });

    it('calls message after a message is received', () => {
        const data = 'test123';
        let message = jasmine.createSpy('message');

        socket.message = message;
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._mockReceive(data);

        expect(message).toHaveBeenCalledWith({ data: data });
    });

    it('sends the data sent', () => {
        const data = 'test123';

        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._mockConnected();
        var result = socket.send(data);

        expect(result).toBe(true);
        expect(socket._webSocket.send).toHaveBeenCalledWith(data);
    });

    it('doesn\'t send the data when the data is undefined', () => {
        socket.connect('ws://localhost:1234/ws');
        socket._webSocket._mockConnected();
        var result = socket.send();

        expect(result).toBe(false);
        expect(socket._webSocket.send).not.toHaveBeenCalled();
    });

    it('doesn\'t send the data when the socket isn\'t connected', () => {
        var result = socket.send('test123');

        expect(result).toBe(false);
    });

    it('doesn\'t bind the WebSocket when it hasn\'t been created', () => {
        expect(() => socket._bindWebSocket()).not.toThrow();
    });

    it('doesn\'t end the connection process if it hasn\'t begun', () => {
        expect(() => socket._endConnect()).not.toThrow();
    });
});
