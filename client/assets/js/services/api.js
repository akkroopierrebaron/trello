(function () {
    "use strict";

    angular.module('application')
        .service('Api', Api);

    Api.$inject = ['$q'];
    function Api($q) {
        var service = {
            getAllElements      : getAllElements,
            getMultipleElements : getMultipleElements,
            getSingleElement    : getSingleElement
        };
        return service;

        function getAllElements(path, params) {
            var deferred = $q.defer();

            Trello.get(path, params, successCallback, errorCallback);

            return deferred.promise;


            function successCallback(result) {
                deferred.resolve(result);
            }

            function errorCallback(error) {
                deferred.reject(error);
            }
        }

        function getMultipleElements(elements, elementsName, elementProperty) {
            var deferred = $q.defer();

            var results = elementsName.find(function (elName) {
                var res = elements.find(function (el) {
                    return el[elementProperty] === elName;
                });

                if (!res) {
                    deferred.reject("No value found for " + elName);
                }

                return res;
            });

            if (results) {
                deferred.resolve(results);
            }
            else {
                deferred.reject("No value found for " + elementsName);
            }

            return deferred.promise;
        }

        function getSingleElement(elements, elementName, elementProperty) {
            var deferred = $q.defer();

            var result = elements.find(function (el) {
                return el[elementProperty] === elementName;
            });
            if (result) {
                deferred.resolve(result);
            }
            else {
                deferred.reject("No value found for " + elementName);
            }

            return deferred.promise;
        }
    }
})();
