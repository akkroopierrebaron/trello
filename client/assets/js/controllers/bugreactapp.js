(function () {
    "use strict";

    angular.module('application')
        .controller('BugReactAppCtrl', BugReactAppCtrl);

    BugReactAppCtrl.$inject = [
        '$scope', '$rootScope', '$stateParams', '$state', '$controller', 'ApiCards', 'ApiLabels', 'ApiLists', 'ApiMembers', 'ENV', 'ModalFactory', '$q'
    ];
    function BugReactAppCtrl($scope, $rootScope, $stateParams, $state, $controller, ApiCards, ApiLabels, ApiLists, ApiMembers, ENV, ModalFactory, $q) {
        angular.extend(this, $controller('DefaultController', {
            $scope       : $scope,
            $stateParams : $stateParams,
            $state       : $state
        }));

        $rootScope.title = "Bug Akkroo++";

        var errorModalConfig = {
            templateUrl  : 'templates/modals/error.html',
            contentScope : {
                title   : "",
                message : ""
            },
            animationIn  : 'slideInFromTop'
        };

        var cardCreatedConfig = {
            templateUrl  : 'templates/modals/cardCreated.html',
            contentScope : {
                createFromExisting : createFromExisting,
                createFromScratch  : createFromScratch,
                letMeAlone         : letMeAlone,
                url                : ""
            },
            animationIn  : 'slideInFromTop'
        };

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
        $scope.submitLoading = false;

        $scope.originalCard = angular.copy($scope.card);

        activate();

        $scope.submitCard = submitCard;

        function activate() {
            var getAllLabelsPromise = ApiLabels.getAllLabels();
            var getAllMembers = ApiMembers.getAllMembers();
            var getList = ApiLists.getList(ENV.bugReactApp.list);

            $q.all([getAllLabelsPromise, getAllMembers, getList])
                .then(function (results) {
                    var labels = results[0];
                    var members = results[1];
                    var list = results[2];

                    $scope.form.labels = labels.filter(function (label) {
                        return label.name;
                    });
                    var preselectedLabels = ENV.bugReactApp.labels;

                    $scope.card.idLabels = labels
                        .filter(function (label) {
                            return preselectedLabels.find(label.name) !== undefined;
                        })
                        .map(function (label) { return label.id; });

                    $scope.form.members = members;
                    $scope.card.idList = list.id;

                    $scope.originalCard.idLabels = angular.copy($scope.card.idLabels);
                    $scope.originalCard.idList = angular.copy($scope.card.idList);
                })
                .catch(function (error) {
                    console.error(error);
                    var config = angular.copy(errorModalConfig);
                    config.contentScope.title = "Too bad !";
                    config.contentScope.message = "We are not able to load the required configuration. Please try again later.";
                    $scope.errorModal = new ModalFactory(config);
                    $scope.errorModal.activate();
                });
        }

        function submitCard(card) {
            $scope.submitLoading = true;

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
                    var config = angular.copy(cardCreatedConfig);
                    config.contentScope.url = card.shortUrl;

                    $scope.createdCardModal = new ModalFactory(config);
                    $scope.createdCardModal.activate();
                })
                .catch(function (error) {
                    console.error(error);

                    var config = angular.copy(errorModalConfig);
                    config.contentScope.title = "Ho no, we have not been able to create the card :(";
                    config.contentScope.message = "The error has been logged in the JS console of your browser";
                    $scope.errorModal = new ModalFactory(config);
                    $scope.errorModal.activate();
                })
                .finally(function () {
                    $scope.submitLoading = false;
                });
        }

        function createFromExisting() {
            $scope.card = Object.merge($scope.card, {
                name     : "",
                page     : "",
                context  : "",
                actions  : "",
                result   : "",
                expected : ""
            });

            $scope.createdCardModal.deactivate();
        }

        function createFromScratch() {
            $scope.card = Object.merge($scope.card, $scope.originalCard);

            $scope.createdCardModal.deactivate();
        }

        function letMeAlone() {
            $scope.createdCardModal.deactivate();
            $state.go("home");
        }

        function createDescription(obj) {
            var string = "" +
                "# Page \r\n" + obj.page + " \r\n \r\n" +
                "# Context \r\n" + obj.context + " \r\n \r\n" +
                "# Actions \r\n" + obj.actions + " \r\n \r\n" +
                "# Result \r\n" + obj.result + " \r\n \r\n" +
                "# Expected \r\n" + obj.expected + " \r\n \r\n" +
                "# Miscellaneous \r\n" + obj.information;
            return string;
        }
    }
})();
