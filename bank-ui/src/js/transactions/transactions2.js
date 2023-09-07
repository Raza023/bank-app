
(function() {
    'use strict';

    function BankService($resource) {
        return $resource('api/v1/bankAccount/:id', { id: '@id' }, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            },
            save: {
                method: 'POST'
            },
            remove: {
                method: 'DELETE'
            }
        });
    }

    angular.module('bank-fe').factory('BankService', ['$resource', BankService]);

    function BankService2($resource) {
        return $resource('/api/v1/bankTransaction/transactions/:userId', {}, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET',
                params: { userId: '@userId' },
            },
            save: {
                method: 'POST'
            },
            remove: {
                method: 'DELETE'
            }
        });
    }

    angular.module('bank-fe').factory('BankService2', ['$resource', BankService2]);

    angular.module('bank-fe').factory('SharedDataService', function() {
        var self = this;
        self.sharedData = {};
        self.sharedData.bankItem = {};
        self.sharedData.loggedIn = {};
        self.sharedData.balance = {};
        self.sharedData.balanceId = 1;
        self.sharedData.transactions = [];
        self.sharedData.displayTrans = false;
        return this;
    });

    function BankController2(BankService, BankService2, $routeParams,  $http, $location, $scope, SharedDataService) {
        var self = this;

        self.service = BankService;
        self.service2 = BankService2;
        self.bank = [];
        self.title = '';
        self.display = false;
        self.displayTrans = SharedDataService.sharedData.displayTrans;
        self.transactions = SharedDataService.sharedData.transactions;
        self.bankItem = SharedDataService.sharedData.bankItem;
        self.loggedInUser = SharedDataService.sharedData.loggedIn; // Add a property for the logged-in user
        self.balanceId = SharedDataService.sharedData.balanceId;
        self.balance = SharedDataService.sharedData.balance; // Add a property for the logged-in user


        self.init = function() {
            self.showTransactions(self.transactions);
        }

        self.showTransactions = function(item)
        {

            $location.path('/showTransactions/' + item.userId);

            console.log(item.userId);

            self.service2.get({ userId: item.userId }).$promise
            .then(function(response) {

                self.displayTrans = true;
                SharedDataService.sharedData.displayTrans = self.displayTrans;

                self.transactions = response.content;
                SharedDataService.sharedData.transactions = self.transactions;

                console.log(self.displayTrans);
                console.log(self.transactions);
            })
            .catch(function(error) {
                console.log('Error fetching user data:', error);
            });
        }


        self.init();
    }

    angular.module("bank-fe").controller('BankController2', ['BankService','BankService2', '$routeParams' ,'$http', '$location', '$scope', 'SharedDataService', BankController2]);

}());