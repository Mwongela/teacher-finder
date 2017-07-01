'use strict';

/**
 * @ngdoc function
 * @name scApp.controller:FoodCtrl
 * @description
 * # FoodCtrl
 * Controller of the scApp
 */
angular.module('scApp')
	.controller('FoodCtrl', function ($scope, Constants, $http) {

		$scope.food = {
			id: "",
			name: "",
			description: "",
			category: "drink",
			price: 0
		};

		$scope.foods = [];

		// load food information from the server
		$http.post(Constants.url, $.param({action: 'get_all_food'}), {headers: Constants.headers})
		.then(function(data) {

			var response = data.data;
			if(response.success === 1) {

				$scope.foods = response.foods;

			}
		});

		$scope.formSubmitted = function() {

			var food = $scope.food;

			if(typeof food.name === "undefined" || food.name === "" ||
				typeof food.description === "undefined" || food.description === "" ||
				typeof food.category === "undefined" || food.category === "" ||
				typeof food.price === "undefined" || food.price === "") {
				window.alert("Invalid input");
				return;
			}

			var params = {
				name: food.name,
				description: food.description,
				category: food.category,
				price: food.price,
				action: "add_food"
			};

			$http.post(Constants.url, $.param(params), {
				headers: Constants.headers
			}).then(function(successfulResponse) {
				var response = successfulResponse.data;
				if(response.success == 1) {
					$scope.food.id = response.id;
					$scope.foods.push($scope.food);
					$scope.food = {
						id: "",
						name: "",
						description: "",
						category: "drink",
						price: 0
					};
				}
				window.alert(response.message);

			}, function(errorResponse) {
				window.alert(error.statusText);
			});
		}

		$scope.deleteFood = function(food) {
			var confirm = window.confirm("Are you sure you want to delete "  + food.name);
			if(confirm) {

				$http.post(Constants.url, $.param({action: "delete_food", id: food.id}), {headers: Constants.headers})
				.then(function(data) {
					var response = data.data;
					if(response.success === 1) {
						$scope.foods.splice($scope.foods.indexOf(food), 1);
					}
					window.alert(response.message);
				}, function(error) {});

			}
		}

	});
