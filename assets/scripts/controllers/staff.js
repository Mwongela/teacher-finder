'use strict';

/**
 * @ngdoc function
 * @name scApp.controller:StaffCtrl
 * @description
 * # StaffCtrl
 * Controller of the scApp
 */
angular.module('scApp')
	.controller('StaffCtrl', function ($scope, $http, Constants) {

		$scope.staffs = [];
		$scope.staff = {
			id: "",
			name: "",
			email: "",
			phone: "",
			role: "",
			pwd: ""
		};

		//get all staffs
		$http.post(Constants.url, $.param({action: "get_all_staff"}), {headers: Constants.headers})
		.then(function(data) {
			var response = data.data;
			if(response.success === 1) {
				$scope.staffs = response.staffs;
			}
		});

		$scope.formSubmitted = function () {
			var params = $scope.staff;
			params.action = "add_staff";
			console.log($scope.staff);
			$http.post(Constants.url, $.param(params), {headers: Constants.headers})
			.then(function(data) {
				var response = data.data;
				if(response.success == 1) {
					params.id = response.id;
					delete params.action;
					$scope.staffs.push(params);
				}
				window.alert(response.message);
			}, function(error) {
				window.alert(error.statusText);
			});
		};

		$scope.deleteStaff = function(staff) {
			var confirm = window.confirm("Delete " + staff.name + "?");

			if(confirm) {
				$http.post(Constants.url, $.param({action: "delete_staff", id: staff.id}), {headers: Constants.headers})
				.then(function(data) {
					var response = data.data;
					if(response.success == 1) {
						var index = $scope.staffs.indexOf(staff);
						$scope.staffs.splice(index, 1);
					}
					window.alert(response.message);
				}, function(error) {
					window.alert(error.statusText);
				});
			}
		}

	});
