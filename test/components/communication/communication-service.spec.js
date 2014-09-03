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

import '../../mock/components/socket/socket-factory.mock';

describe('components.communication.CommunicationService', function() {
    const WEB_SOCKET_ADDRESS = 'ws://localhost:51852/ws';
    var communication;

    beforeEach(module('components.communication'));
    beforeEach(module('mock.components.socket'));
    beforeEach(module(($provide) => {
        $provide.constant('webSocketAddress', WEB_SOCKET_ADDRESS);
    }));

    beforeEach(inject((_communicationService_) => {
        communication = _communicationService_;
    }));

    it('isn\'t null', () => {
        expect(communication).not.toBe(null);
    });

    it('doesn\'t have a null WebSocket', () => {
        expect(communication._webSocket).not.toBe(null);
    });

    it('isn\'t connected by default', () => {
        expect(communication.isConnected).toBe(false);
    });

    it('isn\'t connecting by default', () => {
        expect(communication.isConnecting).toBe(false);
    });

    it('connects when not connected', () => {
        var result = communication.connect();
        expect(result).toBe(true);
    });

    it('is connected after calling connect', () => {
        var result = communication.connect();
        expect(result).toBe(true);
        expect(communication.isConnected).toBe(true);
    });

    it('doesn\'t connect when already connected', () => {
        communication.connect();
        var result = communication.connect();
        expect(result).toBe(false);
    });

    it('calls _onOpen after connecting', () => {
        spyOn(communication, '_onOpen');

        communication._socket._mockOpen();
        expect(communication._onOpen).toHaveBeenCalled();
    });

    it('broadcasts CommunicationService.connected after connecting', () => {
        spyOn(communication.$rootScope, '$broadcast');

        communication._socket._mockOpen();
        expect(communication.$rootScope.$broadcast).toHaveBeenCalledWith(
            'CommunicationService.connected');
    });

    it('calls _onClose after connecting', () => {
        spyOn(communication, '_onClose');

        communication._socket._mockClose();
        expect(communication._onClose).toHaveBeenCalled();
    });

    it('broadcasts CommunicationService.disconnected after connecting', () => {
        spyOn(communication.$rootScope, '$broadcast');

        communication._socket._mockClose();
        expect(communication.$rootScope.$broadcast).toHaveBeenCalledWith(
            'CommunicationService.disconnected');
    });

    it('calls _onError after erroring', () => {
        spyOn(communication, '_onError');

        communication._socket._mockError();
        expect(communication._onError).toHaveBeenCalled();
    });

    it('broadcasts CommunicationService.error after connecting', () => {
        spyOn(communication.$rootScope, '$broadcast');

        communication._socket._mockError();
        expect(communication.$rootScope.$broadcast).toHaveBeenCalledWith(
            'CommunicationService.error');
    });

    it('calls _onMessage after a message is received', () => {
        spyOn(communication, '_onMessage');

        communication._socket._mockMessage();
        expect(communication._onMessage).toHaveBeenCalled();
    });

    it('broadcasts CommunicationService.message after connecting', () => {
        spyOn(communication.$rootScope, '$broadcast');

        communication._socket._mockMessage();
        expect(communication.$rootScope.$broadcast).toHaveBeenCalledWith(
            'CommunicationService.message');
    });
});
