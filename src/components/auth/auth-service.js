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

import {authModule} from './auth';

/**
 * Restrict user access based on the page's access state.
 * @type {Object}
 */
export const AccessState = {
    /**
     * All users can access the page.
     * @type {Number}
     */
    All: 0,

    /**
     * Only users not logged into Spotify can access the page.
     * @type {Number}
     */
    Guest: 1,

    /**
     * Only users logged intto Spotify can access the page.
     * @type {Number}
     */
    User: 2
};

export class AuthService {
    /**
     * Whether the user is logged into Spotify.
     * @return {Boolean} A value determining whether the user is logged into
     *  Spotify.
     */
    get isLoggedIn() {
        return false;
    }

    /**
     * Check whether the user can access a page with the specified access state.
     * @param  {AccessState} accessState The page's access state.
     * @return {Boolean} Whether the user can access the page.
     */
    canAccess(accessState) {
        switch (accessState) {
            case AccessState.Guest:
                return !this.isLoggedIn;
            case AccessState.User:
                return this.isLoggedIn;
            default:
                return true;
        }
    }
}

authModule.service('authService', AuthService);
