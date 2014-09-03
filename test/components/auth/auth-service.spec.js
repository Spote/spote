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
import {AccessState} from 'components/auth/auth-service';

describe('components.auth.AuthService', function() {
    var auth;

    beforeEach(module('components.auth'));
    beforeEach(inject((_authService_) => {
        auth = _authService_;
    }));

    it('isn\'t null', () => {
        expect(auth).not.toBe(null);
    });

    it('isn\'t logged in by default', () => {
        expect(auth.isLoggedIn).toBe(false);
    });

    it('can access guest pages when not logged in', () => {
        var result = auth.canAccess(AccessState.Guest);
        expect(result).toBe(true);
    });

    it('can\'t access user pages when not logged in', () => {
        var result = auth.canAccess(AccessState.User);
        expect(result).toBe(false);
    });

    it('can access global pages', () => {
        var result = auth.canAccess(AccessState.All);
        expect(result).toBe(true);
    });
});
