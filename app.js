(function(){
	var app = angular.module('paymentsApp', []);

	app.controller('paymentController', function($scope,  $filter) {
		$scope.statusCheckBoxes = statusCheckBoxes;

		$scope.numRecordsPerPage = 5; //Default
		$scope.pages = [];
		$scope.paymentRecords = [];
		$scope.dataRecords = paymentRecords;
		$scope.numRecordsNotValid = false;
		// $scope.totalRecords = paymentRecords.length;

		$scope.$watchCollection(function() {
			var checkBoxes = [];
			$scope.statusCheckBoxes.forEach(function(chkbox) {
				checkBoxes.push(chkbox.value);
			});
			return checkBoxes;
		}, function(newValue, oldValue, scope) {
			var filters = $filter("filter")( scope.statusCheckBoxes, {value: true});
			scope.dataRecords = paymentRecords.filter(function(record) {
				if(filters.length === 0){
					return true;
				}
				for(var i=0; i< filters.length; i++) {
					if(record.paymentStatus === filters[i].label) {
						return true;
					}
				}
				return false;
			});
		}.bind(this));

		$scope.setCurrent = function(page) {
			$scope.currentPage = page.pageNumber;
			$scope.paymentRecords = page.paymentRecords;
		};

		//$scope.$watch('numRecordsPerPage', function(newValue, oldValue, scope) {
		//paginate(scope);
		//});

		$scope.onNumRecordsChanged = function() {
			if(isNaN(this.numRecordsPerPage)) { 
				$scope.numRecordsNotValid = true;
			} else {
				$scope.numRecordsNotValid = false;
				paginate($scope);
			}
		};

		$scope.$watch('dataRecords', function(newValue, oldValue, scope) {
			paginate(scope);
		}.bind(this));

		function paginate(scope) {
			var pages = [], newPage,
				records = scope.dataRecords,
				num = scope.numRecordsPerPage;
			if(records.length <= num) {
				newPage = {};
				newPage.pageNumber = 1;
				newPage.paymentRecords = records;
				pages.push(newPage);
				// this.paymentRecords = records;
				// this.hidePagination();
			} else {
				var len = records.length, i = 0, j=1, n= len/num;
				while (i < len) {
					newPage = {};
					newPage.pageNumber = j++;
					newPage.paymentRecords = [];
					var size = Math.ceil((len - i) / n--);
					newPage.paymentRecords = records.slice(i, i += size);
					pages.push(newPage);
				}
			}
			scope.pages = pages;
			scope.setCurrent(pages[0]);
		} 
	});

	var statusCheckBoxes = [
		{
			label: "Initiated",
			value: false
		},
		{
			label: "Failed",
			value: false
		},
		{
			label: "Dropped",
			value: false
		},
		{
			label: "Success",
			value: false
		},
		{
			label: "Refunded",
			value: false
		}
	];

})();