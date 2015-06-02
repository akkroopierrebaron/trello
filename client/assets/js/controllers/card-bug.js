(function () {
    "use strict";

    angular.module('application')
        .controller('CardBugCtrl', CardBugCtrl);

    CardBugCtrl.$inject = [
        '$scope', '$stateParams', '$state', '$controller', 'ApiCards', 'ApiLabels', 'ApiLists', 'ApiMembers', 'ENV'
    ];
    function CardBugCtrl($scope, $stateParams, $state, $controller, ApiCards, ApiLabels, ApiMembers, ApiLists, ENV) {
        angular.extend(this, $controller('DefaultController', {
            $scope       : $scope,
            $stateParams : $stateParams,
            $state       : $state
        }));

        $scope.form = {
            labels  : [],
            members : []
        };

        $scope.card = {
            name      : "",
            page      : "",
            context   : "",
            actions   : "",
            result    : "",
            expected  : "",
            idLabels  : [],
            idMembers : []
        };

        activate();
        $scope.submitCard = submitCard;

        function activate() {
            ApiLabels
                .getAllLabels()
                .then(function (labels) {
                    $scope.form.labels = labels;

                    var preselectedLabels = [ENV.labels.bug, ENV.labels.reproduced];

                    $scope.card.idLabels = labels
                        .filter(function (label) {
                            return preselectedLabels.find(label.name) !== undefined;
                        })
                        .map(function (label) { return label.id; });
                });

            ApiMembers
                .getAllMembers()
                .then(function (members) {
                    $scope.form.members = members;
                });

            ApiLists
                .getList(ENV.lists.bugs)
                .then(function (list) {
                    $scope.card.idList = list.id;
                });
        }

        function submitCard() {
            var args = {
                name      : $scope.card.name,
                desc      : createDescription($scope.card),
                idMembers : $scope.card.idMembers,
                idLabels  : $scope.card.idLabels,
                idList    : $scope.card.idList,
                due       : null,
                urlSource : null
            };

            ApiCards
                .postCard(args)
                .then(function (card) {
                    console.log("card created", card);
                });
        }

        function createDescription(obj) {
            var string = "" +
                "# Page \r\n" + obj.page + " \r\n \r\n" +
                "# Context \r\n" + obj.context + " \r\n \r\n" +
                "# Context \r\n" + obj.context + " \r\n \r\n" +
                "# Actions \r\n" + obj.result + " \r\n \r\n" +
                "# Expected \r\n" + obj.expected;

            return string;
        }
    }
})();
