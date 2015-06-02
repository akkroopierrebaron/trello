(function () {
    "use strict";

    angular.module('application')
        .service('ApiMembers', ApiMembers);

    ApiMembers.$inject = ['Api', 'ApiBoards', 'ENV'];
    function ApiMembers(Api, ApiBoards, ENV) {
        var service = {
            getAllMembers      : getAllMembers,
            getMultipleMembers : getMultipleMembers,
            getMember          : getMember
        };
        return service;


        function getAllMembers() {
            return ApiBoards.getBoard(ENV.board)
                .then(function (board) {
                    return Api.getAllElements("boards/" + board.id + "/members");
                });
        }

        function getMultipleMembers(membersUsername) {
            return getAllMembers()
                .then(function (members) {
                    return Api.getMultipleElements(members, membersUsername, 'username');
                });
        }

        function getMember(memberUsername) {
            return getAllMembers()
                .then(function (members) {
                    return Api.getSingleElement(members, memberUsername, 'username');
                });
        }
    }
})();
