/* jshint esnext: true */

import communicationModule from './communication';

class CommunicationService {
	test() {
	}
}

communicationModule.service('communicationService', CommunicationService);
