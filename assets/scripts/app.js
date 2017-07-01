'use strict';

/**
 * @ngdoc overview
 * @name scApp
 * @description
 * # scApp
 *
 * Main module of the application.
 */
angular
	.module('scApp', [
		'ngAnimate',
		'ngAria',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ngLodash'
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				controllerAs: 'main'
			})
			.when('/about', {
				templateUrl: 'views/about.html',
				controller: 'AboutCtrl',
				controllerAs: 'about'
			})
			.when('/staff', {
				templateUrl: 'views/staff.html',
				controller: 'StaffCtrl',
				controllerAs: 'staff'
			})
			.when('/staff', {
				templateUrl: 'views/staff.html',
				controller: 'StaffCtrl',
				controllerAs: 'staff'
			})
			.when('/payment', {
				templateUrl: 'views/payment.html',
				controller: 'PaymentCtrl',
				controllerAs: 'payment'
			})
			.when('/booking', {
				templateUrl: 'views/booking.html',
				controller: 'BookingCtrl',
				controllerAs: 'booking'
			})
			.when('/food', {
				templateUrl: 'views/food.html',
				controller: 'FoodCtrl',
				controllerAs: 'food'
			})
			.when('/menu', {
				templateUrl: 'views/menu.html',
				controller: 'MenuCtrl',
				controllerAs: 'menu'
			})
			.otherwise({
				redirectTo: '/'
			});
	})

	.factory("Constants", function() {
		return {
			url: "http://localhost/sc/app/api/index.php",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};
	});
