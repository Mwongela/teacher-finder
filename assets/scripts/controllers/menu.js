'use strict';

/**
 * @ngdoc function
 * @name scApp.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the scApp
 */
angular.module('scApp')
	.controller('MenuCtrl', function ($scope, Constants, $http, lodash) {
		$scope.foods = [];
		$scope.menus = [];
		$scope.menu = {
			id: "",
			date: "",
			category: "",
			menuItems: [],
			aFoods: [],
			oFoods: [],
			aCategory: []
		};

		$scope.selectFood = "";
		$scope.selectCategory = "";

		$scope.updateAvailable = function() {
			$scope.menu.aFood = lodash.difference($scope.foods, $scope.menu.menuItems);
			$scope.menu.oFood = $scope.menu.aFood;
			$scope.menu.aCategory = lodash.uniq(lodash.map($scope.menu.aFood, "category"));
		};

		$scope.filterFoodByCategory = function() {
			if($scope.selectCategory === "") return;

			$scope.menu.aFood = $scope.menu.oFood;

			$scope.menu.aFood = lodash.filter($scope.menu.aFood, {"category": $scope.selectCategory});
		};

		$scope.selectFoodFunc = function() {
			if($scope.selectFood == null || $scope.selectFood === "") return;
			var menuItem = lodash.find($scope.foods, {id: $scope.selectFood});
			if(typeof $scope.menu.menuItems === "undefined")
				$scope.menu.menuItems = [];

			if($scope.menu.menuItems.includes(menuItem))
				return;

			$scope.menu.menuItems.push(menuItem);
		};

		$scope.removeMenuItem = function(menuItem) {
			var index = $scope.menu.menuItems.indexOf(menuItem);
			$scope.menu.menuItems.splice(index, 1);
		};

		$scope.publishMenu = function() {
			// validation
			if($scope.menu.date === "" || $scope.menu.category === "" || $scope.menu.menuItems == null || $scope.menu.menuItems.length == 0) {
				window.alert("Please check your input");
				return;
			}

			// proceed
			var params = $scope.menu;
			delete params.aFoods;
			delete params.aCategory;
			delete params.oFoods;
			params.action = "add_menu";
			var date = params.date.toString();
			date = date.replace(/\(([^)]+)\)/, "");
			params.date = date;

			$http.post(Constants.url, $.param(params), {headers: Constants.headers})
			.then(function(data) {
				var response = data.data;
				console.log(response);
				if(response.success === 1) {
					$scope.menus.push({id: response.id, date: response.date, category: response.category});
					$scope.menu = {
						id: "",
						date: "",
						category: "",
						menuItems: [],
						aFoods: [],
						oFoods: [],
						aCategory: []
					};
					$scope.updateAvailable();
				}
				window.alert(response.message);
			}, function(error) {
				window.alert(error.statusText);
			});

		};

		$scope.viewMenu = function(menu) {
			$http.post(Constants.url, $.param({action: "get_menu", id: menu.id}), {headers: Constants.headers})
			.then(function(data) {
				var response = data.data;
				if(response.success == 1) {
					var menuRecord = response.menu;
					console.log(menuRecord);
					$scope.menu = {
						id: menuRecord.id,
						date: new Date(Date.parse(menuRecord.date)),
						category: menuRecord.category,
						menuItems: menuRecord.menu_item,
						aFoods: [],
						oFoods: [],
						aCategory: []
					};

					$scope.updateAvailable();
				} else {
					window.alert(response.message);
				}
			}, function(error) {
				window.alert(error.statusText);
			});
		};

		$scope.deleteMenu = function(menu) {
			var confirm = window.confirm("Are you sure you want to delete menu?");
			if(confirm) {
				$http.post(Constants.url, $.param({action: "delete_menu", id:menu.id}), {headers: Constants.headers})
				.then(function(data) {
					var response = data.data;
					if(response.success == 1) {
						var index = $scope.menus.indexOf(menu);
						$scope.menus.splice(index, 1);
					}
					window.alert(response.message);
				}, function(error) {
					window.alert(error.statusText);
				});
			}
		}

		// load all the menus
		$http.post(Constants.url, $.param({action: "get_all_menu"}), {headers: Constants.headers})
		.then(function(data) {
			var response = data.data;
			if(response.success === 1) {
				$scope.menus = response.menu;
			}
		});

		// load food information from the server
	$http.post(Constants.url, $.param({action: 'get_all_food'}), {headers: Constants.headers})
	.then(function(data) {

		var response = data.data;
		if(response.success === 1) {

			$scope.foods = response.foods;
			$scope.updateAvailable();

		}
	});


	});
