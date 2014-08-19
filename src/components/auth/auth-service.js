/* jshint esnext: true */

import authModule from './auth';

class AuthService {
	get isLoggedIn() {
		return false;
	}
}

authModule.service('authService', AuthService);
