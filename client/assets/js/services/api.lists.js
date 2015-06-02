(function () {
    "use strict";

    angular.module('application')
        .service('ApiLists', ApiLists);

    ApiLists.$inject = ['Api', 'ApiBoards', 'ENV'];
    function ApiLists(Api, ApiBoards, ENV) {

        var service = {
            getAllLists      : getAllLists,
            getMultipleLists : getMultipleLists,
            getList          : getList
        };
        return service;


        function getAllLists() {
            return ApiBoards.getBoard(ENV.board)
                .then(function (board) {
                    return Api.getAllElements("boards/" + board.id + "/lists");
                });
        }

        function getMultipleLists(labelNames) {
            return getAllLists()
                .then(function (labels) {
                    return Api.getMultipleElements(labels, labelNames, 'name');
                });
        }

        function getList(listName) {
            return getAllLists()
                .then(function (lists) {
                    console.log(lists);
                    return Api.getSingleElement(lists, listName, 'name');
                });
        }
    }
})();
