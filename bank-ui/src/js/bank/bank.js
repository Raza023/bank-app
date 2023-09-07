
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

        self.pass = false;
        self.fail = false;
        self.passmessage = "";
        self.failmessage = "";


        return this;
    });

    function BankController(BankService, BankService2, $routeParams,  $http, $location, $scope, SharedDataService) {
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
            self.search();

            $http.get('/api/v1/bankAccount/auth')
            .then(function(response) {
                // Assuming the user data is available in the response.data
                self.loggedInUser = response.data.content;
                SharedDataService.sharedData.loggedIn = self.loggedInUser; // Update the shared data
                if(response.data.content !== null)
                {
                    self.balanceId = response.data.content.id;
                }
                SharedDataService.sharedData.balanceId = self.balanceId; // Update the shared data
//                console.log(response.data.content);
//                console.log(response.data.content.id);
//                console.log(self.balanceId);
                $http.get('/api/v1/bankBalance/balance/'+self.balanceId)
                .then(function(response) {
                    // Assuming the user data is available in the response.data
                    self.balance = response.data.content;
                    SharedDataService.sharedData.balance = self.balance; // Update the shared data
//                    console.log(response.data.content);
                })
                .catch(function(error) {
                    console.log('Error fetching user data:', error);
                });
            })
            .catch(function(error) {
                console.log('Error fetching user data:', error);
            });

//            console.log(SharedDataService.sharedData.balanceId);
//            console.log(self.balanceId);
        }

        self.search = function() {
            self.display = false;
            var parameters = {};
            if (self.title) {
                parameters.title = '%'+self.title+'%';
            }
            else
            {
                parameters.title = '%';
            }

            self.service.get(parameters).$promise.then(function(response) {
                self.display = true;
                self.bank = response.content;
            });
        }

        self.save = function() {
            self.service.save(self.bankItem).$promise.then(function(response) {
                self.bankItem.id = response.content.id;
            });
        }

        self.showToUpdate = function(item) {

            $location.path('/bank/' + item.id); // Update the URL to include the item's ID

            self.bankItem.id = item.id;
            self.bankItem.name = item.name;
            self.bankItem.password =item.password;
            self.bankItem.roles =item.roles;
            self.bankItem.email= item.email;
            self.bankItem.address= item.address;

//            console.log(self.bankItem);
        };

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

        self.delete = function(item) {
            self.display = false;
            self.bankItem = item;
            if (self.bankItem.id) {
               self.service.delete({ id: self.bankItem.id }).$promise.then(function(deleteResponse) {
                    self.display = true;
                    self.bank = deleteResponse.content;
                });
            } else {
                console.log('Invalid id for deletion.');
            }
        }

        self.init();
    }

    angular.module("bank-fe").controller('BankController', ['BankService','BankService2', '$routeParams' ,'$http', '$location', '$scope', 'SharedDataService', BankController]);

}());