(function () {
    "use strict";

    angular.module('application')
        .controller('FeatureCtrl', FeatureCtrl);

    FeatureCtrl.$inject = [
        '$scope', '$rootScope', '$stateParams', '$state', '$controller', 'ApiCards', 'ApiLabels', 'ApiLists', 'ApiMembers', 'ENV', 'ModalFactory', '$q'
    ];
    function FeatureCtrl($scope, $rootScope, $stateParams, $state, $controller, ApiCards, ApiLabels, ApiLists, ApiMembers, ENV, ModalFactory, $q) {
        angular.extend(this, $controller('DefaultController', {
            $scope       : $scope,
            $stateParams : $stateParams,
            $state       : $state
        }));

        $rootScope.title = "Feature";

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
            name        : "",
            who         : "",
            what        : "",
            why         : "",
            information : "",
            idLabels    : [],
            idMembers : [],
            idList    : ""
        };

        $scope.submitLoading = false;
        $scope.originalCard = angular.copy($scope.card);

        activate();
        $scope.submitCard = submitCard;

        function activate() {
            var getAllLabelsPromise = ApiLabels.getAllLabels();
            var getAllMembers = ApiMembers.getAllMembers();
            var getAllLists = ApiLists.getAllLists(ENV.feature.list);

            $q.all([getAllLabelsPromise, getAllMembers, getAllLists])
                .then(function (results) {
                    var labels = results[0];
                    var members = results[1];
                    var lists = results[2];

                    $scope.form.labels = labels.filter(function (label) {
                        return label.name;
                    });
                    $scope.form.members = members;
                    $scope.form.lists = lists;

                    var preselectedLabels = ENV.feature.labels;
                    $scope.card.idLabels = labels
                        .filter(function (label) { return preselectedLabels.find(label.name) !== undefined; })
                        .map(function (label) { return label.id; });

                    var list = lists.find(function (list) { return list.name === ENV.feature.list; });
                    $scope.card.idList = list !== undefined ? list.id : "";

                    console.log(angular.copy($scope.card));

                    $scope.originalCard = angular.copy($scope.card);
                })
                .catch(function (error) {
                    console.log(error);

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
                name        : "",
                who         : "",
                what        : "",
                why         : "",
                information : ""
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
                createUserStory(obj.who, obj.what, obj.why) + " \r\n \r\n" +
                "# Information \r\n" + obj.information;

            return string;
        }

        function createUserStory(who, what, why) {
            var string = "" +
                "# User story \r\n" +
                "As a " + who + ", " +
                "I would like to be able " + what + " " +
                "so that " + why;

            return string;
        }
    }
})();
