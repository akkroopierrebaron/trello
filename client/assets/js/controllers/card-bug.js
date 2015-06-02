(function () {
    "use strict";

    angular.module('application')
        .controller('CardBugCtrl', CardBugCtrl);

    CardBugCtrl.$inject = [
        '$scope', '$rootScope', '$stateParams', '$state', '$controller', 'ApiCards', 'ApiLabels', 'ApiLists', 'ApiMembers', 'ENV'
    ];
    function CardBugCtrl($scope, $rootScope, $stateParams, $state, $controller, ApiCards, ApiLabels, ApiLists, ApiMembers, ENV) {
        angular.extend(this, $controller('DefaultController', {
            $scope       : $scope,
            $stateParams : $stateParams,
            $state       : $state
        }));

        $rootScope.$broadcast('menu-title-changed', 'Bug');

        $rootScope.menuTitle = "Bug";

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

        $scope.markdown = "";

        activate();
        $scope.submitCard = submitCard;
        $scope.$watch('card', updatePreview, true);

        function activate() {
            ApiLabels
                .getAllLabels()
                .then(function (labels) {
                    $scope.form.labels = labels.filter(function (label) {
                        return label.name;
                    });

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

        function updatePreview() {
            console.log("update preview");
            $scope.markdown = createDescription($scope.card);
        }

        function createDescription(obj) {
            var string = "" +
                "# Page \r\n" + obj.page + " \r\n \r\n" +
                "# Context \r\n" + obj.context + " \r\n \r\n" +
                "# Actions \r\n" + obj.actions + " \r\n \r\n" +
                "# Result \r\n" + obj.expected + " \r\n \r\n" +
                "# Expected \r\n" + obj.result;
            return string;
        }
    }
})();
