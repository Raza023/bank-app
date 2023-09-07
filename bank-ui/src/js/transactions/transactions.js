(function() {
    'use strict';

    // TransactionService definition
    function TransactionService($resource) {
        return $resource('api/v1/bankTransaction/:id', { id: '@id' }, {
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

    // Define the TransactionService and inject dependencies
    angular.module('bank-fe').factory('TransactionService', ['$resource', TransactionService]);

    // BalanceService definition
        function BalanceService($resource) {
            return $resource('api/v1/bankBalance/:id', { id: '@id' }, {
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

        // Define the BalanceService and inject dependencies
        angular.module('bank-fe').factory('BalanceService', ['$resource', BalanceService]);

    // AccountService definition
    function AccountService($resource) {
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

    // Define the TransactionService and inject dependencies
    angular.module('bank-fe').factory('AccountService', ['$resource', AccountService]);

    // TransactionController definition

    function TransactionController(TransactionService, AccountService, BalanceService, $routeParams, $http, $location, $scope, SharedDataService) {
        var self = this;

        self.service = TransactionService;
        self.service2 = AccountService;
        self.service3 = BalanceService;
        self.display = false;
        self.transactions = [];
        self.transactionItem = {};                                // Define the transaction item as needed
        self.receiverTransactionItem = {};                                // Define the transaction item as needed
        self.loggedInUser = SharedDataService.sharedData.loggedIn; // Assuming this property is already defined
        self.balanceId = SharedDataService.sharedData.balanceId; // Assuming this property is already defined
        self.balance = SharedDataService.sharedData.balance; // Assuming this property is already defined
        self.emails = [];
        self.selectedEmail = '';
        self.receiverId = '';

        console.log()

        self.init = function() {
            self.populateEmails();
            // Get the current date
            var currentDate = new Date();

            // Get the day, month, and year
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1; // January is 0
            var year = currentDate.getFullYear();

            // Create a string in the format YYYY-MM-DD
            var dateString = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

            // Set the current date to your model
//            self.transactionItem.date = dateString;
//            self.search();
        }

        self.populateEmails = function() {
            self.display = false;
            self.service2.get().$promise.then(function(response) {
                self.display = true;
                self.emails = response.content;
                console.log(self.emails);
            });
        }

        self.save = function() {
            console.log(self.transactionItem);
            console.log(self.loggedInUser.id);
            self.transactionItem.userId = self.loggedInUser.id;

            self.balanceId = self.loggedInUser.id;
            SharedDataService.sharedData.balanceId = self.balanceId; // Update the shared data

            $http.get('/api/v1/bankBalance/balance/'+self.balanceId)
            .then(function(response) {
                // Assuming the user data is available in the response.data
                self.balance = response.data.content;
                SharedDataService.sharedData.balance = self.balance; // Update the shared data
//                    console.log(response.data.content);
                if(self.balance.amount >= self.transactionItem.amount)
                {
                    self.service.save(self.transactionItem).$promise.then(function(response) {
                        self.transactionItem.id = response.content.id;
                        console.log(self.transactionItem);
                        console.log("Sender transaction done.");

                    });

//                    self.balance.id = self.loggedInUser.id;
//                    self.balance.amount = self.balance.amount - self.transactionItem.amount;
//                    self.balance.lastTransaction = self.transactionItem.transactionType;
//                    self.balance.date = self.transactionItem.date;
//                    self.balance.userId = self.loggedInUser.id;
//                    SharedDataService.sharedData.balance = self.balance;
//                    console.log(self.balance);
//
//                    self.service3.save(self.balance).$promise.then(function(response) {
////                        self.balance.id = response.content.id;
//                        console.log(self.balance);
//                        console.log("Sender balance done.");
//                    });
//                    $http.get('/api/v1/bankAccount/email/'+self.selectedEmail)
//                        .then(function(response) {
//                            self.receiverId = response.data.content.id;
//
//                            //amount, description, transactionType, date, userId
//
//                            self.receiverTransactionItem.amount = self.transactionItem.amount;
//                            self.receiverTransactionItem.description = self.transactionItem.description;
//                            self.receiverTransactionItem.transactionType = self.transactionItem.transactionType;
//                            self.receiverTransactionItem.date = self.transactionItem.date;
//                            self.receiverTransactionItem.userId = self.receiverId;
//
//                            self.service.save(self.receiverTransactionItem).$promise.then(function(response) {
//                                self.receiverTransactionItem.id = response.content.id;
//                                console.log(self.receiverTransactionItem);
//                                console.log("Receiver transaction done.");
//                            });
//
//                            $http.get('/api/v1/bankBalance/balance/'+self.receiverId)
//                                .then(function(response) {
//                                    // Assuming the user data is available in the response.data
//                                    self.balance = response.data.content;
//                                    SharedDataService.sharedData.balance = self.balance; // Update the shared data
//
//                                    self.balance.id = self.receiverId;
//                                    self.balance.amount = self.balance.amount + self.transactionItem.amount;
//                                    self.balance.lastTransaction = "credit";
//                                    self.balance.date = self.transactionItem.date;
//                                    self.balance.userId = self.receiverId;
//                                    SharedDataService.sharedData.balance = self.balance;
//                                    console.log(self.balance);
//
//                                    self.service3.save(self.balance).$promise.then(function(response) {
//                //                        self.balance.id = response.content.id;
//                                        console.log(self.balance);
//                                        console.log("Receiver balance done.");
//                                    });
//
//                                }
//
//                        }
                }
                else
                {
                    console.log("You don't have enough bank balance to perform this transaction.")
                }
            })
            .catch(function(error) {
                console.log('Error fetching user data:', error);
            });


        }

        self.init();
    }

    // Define the TransactionController and inject dependencies
    angular.module("bank-fe").controller('TransactionController', ['TransactionService', 'AccountService', 'BalanceService', '$routeParams', '$http', '$location', '$scope', 'SharedDataService', TransactionController]);
}());
