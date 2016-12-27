var _templateObject2 = "\n\t<div class=\"selectbox-container\">\n\t\t <div class=\"selectbox-part left col-md-5 col-sm-12\">\n\t\t\t <div class=\"selectbox-filter\">\n\t\t\t\t<input class=\"form-control\" placeholder=\"Filter results..\" type=\"text\" ng-model=\"filterText\"></input>\n\t\t\t\t<div class=\"icon-search\"></button>\n\t\t\t </div>\n\t\t\t\t \n\t\t\t <div class=\"selectbox-box\">\n\t\t\t\t<ul class=\"selectbox-list\">\n\t\t\t\t\t<li ng-repeat=\"item in data\" ng-click=\"item.state = item.state==='active'?'inactive':'active'\" ng-class=\"item.state\">\n\t\t\t\t\t\t{{item[field]}}\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t\t<div class=\"selectbox-buttons\">\n\t\t\t\t<center>\n\t\t\t\t\t<button class=\"btn btn-primary btn-default\" ng-click=\"chooseAll()\">\n\t\t\t\t\t\tChoose All\n\t\t\t\t\t</button>\n\t\t\t\t</center>\n\t\t\t</div>\n\t\t </div>\n\t    </div>\n\t    <div class=\"selectbox-part outer col-md-1 col-sm-12\">\n\t\t <!-- right and left arrows -->\n\t\t<div class=\"middle\">\n\t\t\t<div class=\"inner\">\n\t\t\t\t<center>\n\t\t\t\t\t <button class=\"btn btn-primary btn-default\" ng-click=\"addToList()\">\n\t\t\t\t\t\t&gt;\n\t\t\t\t\t </button>\n\t\t\t\t\t<div class=\"clear\"></div>\n\t\t\t\t\t <button class=\"btn btn-primary btn-default\" ng-click=\"removeFromList()\">\n\t\t\t\t\t\t&lt;\n\t\t\t\t\t </button>\n\t\t\t\t</center>\n\t\t\t</div>\n\t\t </div>\n\t   </div>\n\t   <div class=\"selectbox-part right col-md-5 col-sm-12\">\t \n\t\t<div class=\"selectbox-box\">\n\t\t\t<ul class=\"selectbox-list\">\n\t\t\t\t<li ng-repeat=\"item in model\" ng-click=\"item.state=item.state==='active'?'inactive':'active'\" ng-class=\"item.state\">\n\t\t\t\t\t{{item[field]}}\n\t\t\t\t</li>\n\t\t\t</ul>\n\t\t  </div>\n\t\t <div class=\"selectbox-buttons\">\n\t\t\t<center>\n\t\t\t\t <button class=\"btn btn-danger\" ng-click=\"removeAll()\">\n\t\t\t\t\tRemove All\n\t\t\t\t</button>\n\t\t\t</center>\n\t\t </div>\n\t    </div>\n\t</div>\n\t";

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

angular.module("selectbox", []).directive("selectbox", function ($parse) {
	return {
		"retrict": "E",
		"scope": {
			"data": "=modelData",
			"field": "=field",
			"model": "=model"
		},
		"template": _templateObject2,
		"link": function (scope, element, attrs) {
			var filterModel = "";
			var uniqueId = scope.$id;
			var fullData = angular.copy(scope.data);
			var field = scope.field;
			scope.filterText = "";
			var selectedData = [];
			function makeStates(list) {
				var listCloned = $.extend([], list);
				for (var i in listCloned) {
					listCloned[i].state = 'inactive';
				}
				return listCloned;
			}

			function checkMatches(model, value) {
				if (value === "") {
					return true;
				}
				if (value.indexOf(model) !== -1) {
					return true;
				}
				return false;
			}

			function removeAlreadyInList(idx) {
				idx = idx || 0;
				var value = scope.data[idx];
				if (idx < scope.data.length) {
					for (var i in scope.model) {
						if (value[field] == scope.model[i][field]) {
							scope.data.splice(scope.data.indexOf(scope.model[i]), 1);
							return removeAlreadyInList(idx);
						}
					}
					return removeAlreadyInList(idx + 1);
				}
			};
			function doSelected(values, list, active_only, idx) {
				idx = idx || 0;
				var value = values[idx];
				if (idx < values.length) {
					if (active_only && value.state === 'active' || !active_only) {
						var valueNew = angular.copy(value);
						valueNew.state = 'inactive';
						values.splice(values.indexOf(value), 1);
						list.push(valueNew);
						return doSelected(values, list, active_only, idx);
					}
					return doSelected(values, list, active_only, idx + 1);
				}
			}
			function getSelected(list) {
				var selectedList = [];
				for (var i in list) {
					if (list[i].style === 'active') {
						selectedList.push(list[i]);
					}
				}
				return selectedList;
			};
			function selectAll(list, state) {
				state = state || 'active';
				for (var i in list) {
					list[i].state = state;
				}
			}
			function unselectAll(list) {
				selectAll(list, 'inactive');
			};

			scope.addToList = function () {
				doSelected(scope.data, scope.model, true);
			};
			scope.removeFromList = function () {
				doSelected(scope.model, scope.data, true);
			};
			scope.getSelectedRight = function () {
				return getSelected(scope.model);
			};
			scope.getSelectedLeft = function () {
				return getSelected(scope.data);
			};
			scope.chooseAll = function () {
				for (var i in scope.data) {
					scope.data[i].state = 'active';
				}
			};
			scope.removeAll = function () {
				selectAll(scope.model);
				doSelected(scope.model, scope.data, true);
			};
			scope.filter = function () {
				var data = fullData;
				var rightData = scope.model;
				var newActiveData = [];
				unselectAll(data);
				for (var i in data) {
					var inRight = false;
					for (var j in rightData) {
						if (rightData[j][field]  === data[i][field] ) {
							inRight = true;
							break;
						}
					}
					var matchVal = data[i][field];
					if (checkMatches(scope.filterText, matchVal) && !inRight) {
						newActiveData.push(data[i]);
					}
				}
				scope.data = newActiveData;
			};
			scope.$watch("filterText", scope.filter);

			removeAlreadyInList();
		}
	};
});

