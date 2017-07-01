'use strict';

/**
 * @ngdoc function
 * @name scApp.controller:BookingCtrl
 * @description
 * # BookingCtrl
 * Controller of the scApp
 */
angular.module('scApp')
  .controller('BookingCtrl', function ($scope, $http, Constants, lodash) {

  	$scope.bookings = [];
  	$scope.booking = "";

  	$http.post(Constants.url, $.param({action: "get_all_booking"}), {headers: Constants.headers})
  	.then(function(data) {
  		var response = data.data;
  		if(response.success == 1) {
  			$scope.bookings = response.bookings;
  		}
  	}, function(error) {window.alert(error.statusText)});

  	$scope.showBooking = function(booking) {
  		$http.post(Constants.url, $.param({action: "get_booking", "id": booking.id}), {headers: Constants.headers})
  		.then(function(data) {
  			var response = data.data;
  			if(response.success == 1) {
  				$scope.booking = response.booking;
  			}
  			window.alert(response.message);
  		}, function(error) {window.alert(error.statusText)});
  	}

  	$scope.processBooking = function(id) {
  		var confirm = window.confirm("You are about to confirm a Booking. Continue?");

  		if(confirm) {
  			$http.post(Constants.url, $.param({action: "update_booking_status", "id": id}), {headers: Constants.headers})
  			.then(function(data) {
  				var response = data.data;
  				if(response.success == 1) {
  					$scope.booking = "";
  					var record = lodash.find($scope.bookings, {'id': id});
  					var index = $scope.bookings.indexOf(record);
  					$scope.bookings[index].status = "processed";
  				}
  				window.alert(response.message);
  			}, function(error) {window.alert(error.statusText)})
  		}
  	}

  });
