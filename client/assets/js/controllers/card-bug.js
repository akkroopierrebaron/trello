(function () {
    "use strict";

    angular.module('application')
        .controller('CardBugCtrl', CardBugCtrl);

    CardBugCtrl.$inject = [
        '$scope', '$rootScope', '$stateParams', '$state', '$controller', 'ApiCards', 'ApiLabels', 'ApiLists', 'ApiMembers', 'ENV', 'ModalFactory', '$q'
    ];
    function CardBugCtrl($scope, $rootScope, $stateParams, $state, $controller, ApiCards, ApiLabels, ApiLists, ApiMembers, ENV, ModalFactory, $q) {
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

        $scope.originalCard = angular.copy($scope.card);

        $scope.markdown = "";

        activate();

        $scope.submitCard = submitCard;

        function activate() {
            var getAllLabelsPromise = ApiLabels.getAllLabels();
            var getAllMembers = ApiMembers.getAllMembers();
            var getList = ApiLists.getList(ENV.lists.bugs);

            $q.all([getAllLabelsPromise, getAllMembers, getList])
                .then(function (results) {
                    var labels = results[0];
                    var members = results[1];
                    var list = results[2];

                    $scope.form.labels = labels.filter(function (label) {
                        return label.name;
                    });
                    var preselectedLabels = [ENV.labels.bug, ENV.labels.reproduced];

                    $scope.card.idLabels = labels
                        .filter(function (label) {
                            return preselectedLabels.find(label.name) !== undefined;
                        })
                        .map(function (label) { return label.id; });

                    $scope.form.members = members;
                    $scope.card.idList = list.id;

                    $scope.originalCard.idLabels = angular.copy($scope.card.idLabels);
                    $scope.originalCard.idList = angular.copy($scope.card.idList);
                });

            var config = {
                templateUrl: 'templates/bug/modal.html',
                contentScope: {
                    createFromExisting : createFromExisting,
                    createFromScratch  : createFromScratch,
                    letMeAlone         : letMeAlone,
                },
                animationIn: 'slideInFromTop'
            }
            $scope.modal = new ModalFactory(config);
        }

        function submitCard(card) {
            var args = {
                name      : card.name,
                desc      : createDescription(card),
                idMembers : card.idMembers,
                idLabels  : card.idLabels,
                idList    : card.idList,
                due       : null,
                urlSource : null
            };

            ApiCards
                .postCard(args)
                .then(function (card) {
                    $scope.modal.activate();
                });
        }

        function createFromExisting() {
            $scope.card = angular.extend({}, $scope.card, {
                name      : "",
                page      : "",
                context   : "",
                actions   : "",
                result    : "",
                expected  : "",
            });

            $scope.modal.deactivate();
        }

        function createFromScratch() {
             $scope.card = angular.extend({}, $scope.card, $scope.originalCard);

            $scope.modal.deactivate();
        }

        function letMeAlone() {
            $scope.modal.deactivate();
            state.go("home");
        }

        function createDescription(obj) {
            var string = "" +
                "# Page \r\n" + obj.page + " \r\n \r\n" +
                "# Context \r\n" + obj.context + " \r\n \r\n" +
                "# Actions \r\n" + obj.actions + " \r\n \r\n" +
                "# Result \r\n" + obj.result + " \r\n \r\n" +
                "# Expected \r\n" + obj.expected;
            return string;
        }
    }
})();
