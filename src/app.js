/* jshint esnext: true */
/* global angular: false */

import configureUrlRouter from './config/url-router';
import stateChange from './run/state-change';

import AppController from './app-controller';
import './home/home-controller';
import './guest/login/login-controller';

import './components/communication/communication-service';
import './components/auth/auth-service';

let app = angular.module('app', [
        'ui.router',
        'components.communication',
        'components.auth',
        'home',
        'guest.login'
    ])
    .constant('accessStateConst', {
        guest: false,
        user: true
    })
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
            'accessStateConst', configureUrlRouter])
    .run(['$rootScope', '$state', 'authService', stateChange])
    .controller('AppController', ['communicationService', AppController]);
