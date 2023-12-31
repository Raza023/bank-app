(function () {
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
        self.loggedInUser = SharedDataService.sharedData.loggedInUser; // Assuming this property is already defined
        self.balanceId = SharedDataService.sharedData.balanceId; // Assuming this property is already defined
        self.balance = SharedDataService.sharedData.balance; // Assuming this property is already defined
        self.emails = [];
        self.selectedEmail = '';
        self.receiverId = '';

        console.log()

        self.init = function () {
            self.populateEmails();
            // Get the current date
            // var currentDate = new Date();

            // // Get the day, month, and year
            // var day = currentDate.getDate();
            // var month = currentDate.getMonth() + 1; // January is 0
            // var year = currentDate.getFullYear();

            // // Create a string in the format YYYY-MM-DD
            // var dateString = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

            // // Create a Date object from the string
            // var dateObject = new Date(dateString);

            // //            console.log(dateObject);
            // // Set the current date to your model
            // self.transactionItem.date = dateObject;

            // console.log(self.transactionItem.date);

            self.transactionItem.date = new Date();//.toISOString();//.slice(0, 10); // Format as yyyy-MM-dd
            console.log(self.transactionItem.date);
            //            self.search();
        }

        self.populateEmails = function () {

            const myToken = sessionStorage.getItem('jwtToken');

            self.display = false;

            $http({
                method: 'GET',
                url: '/api/v1/bankAccount',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + myToken
                },
                data: {},
                params: {}
            }).then(function (response) {
                self.display = true;
                self.emails = response.data.content;
                //                console.log(self.emails);
                let filteredEmails = self.emails.filter(email => email.email !== sessionStorage.getItem('email'));
                self.emails = filteredEmails;   //loggedInUser email excluded.
                console.log(self.emails);
                //                console.log(filteredEmails);
            });
        }

        self.save = function () {
            self.transactionItem.userId = sessionStorage.getItem('id');

            const myToken = sessionStorage.getItem('jwtToken');

            if (self.transactionItem.id) {
                document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Transaction has already been done. Refresh this page and commit another transaction.</strong></div>';
                //nothing to do here. :)  just chill out
            }
            else {
                $http.get('/api/v1/bankBalance/balance/' + sessionStorage.getItem('id'), {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + myToken
                    }
                })
                    .then(function (response) {
                        // Assuming the user data is available in the response.data
                        self.balance = response.data.content;
                        SharedDataService.sharedData.balance = self.balance; // Update the shared data

                        self.balanceId = response.data.content.id;
                        SharedDataService.sharedData.balanceId = self.balanceId; // Update the shared data
                        console.log(response.data.content);
                        if (self.balance.amount >= self.transactionItem.amount) {

                            $http({
                                method: 'POST',
                                url: '/api/v1/bankTransaction',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + myToken
                                },
                                data: self.transactionItem,
                                params: {}
                            }).then(function (response) {
                                self.transactionItem.id = response.data.content.id;
                                console.log("Sender transaction done.");

                                console.log(self.transactionItem);

                                self.balance.id = self.balanceId;
                                self.balance.amount = self.balance.amount - self.transactionItem.amount;
                                self.balance.lastTransaction = self.transactionItem.transactionType;
                                self.balance.date = self.transactionItem.date;
                                self.balance.userId = sessionStorage.getItem('id');
                                SharedDataService.sharedData.balance = self.balance;
                                console.log(self.balance);

                                $http({
                                    method: 'POST',
                                    url: '/api/v1/bankBalance/'+self.balance.id,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + myToken
                                    },
                                    data: self.balance,
                                    params: {
                                    }
                                }).then(function (response) {
                                    // self.balance.id = response.data.content.id;
                                    console.log(response.data);
                                    console.log("Sender balance done.");

                                    $http.get('/api/v1/bankAccount/email/' + self.selectedEmail,{
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": "Bearer " + myToken
                                        }
                                    })
                                        .then(function (response) {
                                            self.receiverId = response.data.content.id;

                                            //amount, description, transactionType, date, userId

                                            self.receiverTransactionItem.amount = self.transactionItem.amount;
                                            self.receiverTransactionItem.description = self.transactionItem.description;
                                            self.receiverTransactionItem.transactionType = "credit";
                                            self.receiverTransactionItem.date = self.transactionItem.date;
                                            self.receiverTransactionItem.userId = self.receiverId;


                                            console.log(self.receiverTransactionItem);

                                            $http({
                                                method: 'POST',
                                                url: '/api/v1/bankTransaction',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'Bearer ' + myToken
                                                },
                                                data: self.receiverTransactionItem,
                                                params: {}
                                            }).then(function (response) {
                                                self.receiverTransactionItem.id = response.data.content.id;
                                                console.log(self.receiverTransactionItem);
                                                console.log("Receiver transaction done.");


                                                $http.get('/api/v1/bankBalance/balance/' + self.receiverId, {
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        "Authorization": "Bearer " + myToken
                                                    }
                                                }).then(function (response) {
                                                        // Assuming the user data is available in the response.data
                                                        self.balance = response.data.content;
                                                        SharedDataService.sharedData.balance = self.balance; // Update the shared data

                                                        //                                                self.balance.id = self.receiverId;
                                                        self.balance.amount = self.balance.amount + self.transactionItem.amount;
                                                        self.balance.lastTransaction = "credit";
                                                        self.balance.date = self.transactionItem.date;
                                                        //                                                self.balance.userId = self.receiverId;
                                                        SharedDataService.sharedData.balance = self.balance;
                                                        //                                                console.log(self.balance);

                                                        $http({
                                                            method: 'POST',
                                                            url: '/api/v1/bankBalance/'+self.balance.id,
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': 'Bearer ' + myToken
                                                            },
                                                            data: self.balance,
                                                            params: {
                                                            }
                                                        }).then(function (response) {
                                                            //                        self.balance.id = response.content.id;
                                                            console.log(self.balance);
                                                            console.log("Receiver balance done.");

                                                            document.getElementById("showMesssage").innerHTML = '<div class="alert alert-success"><strong>Transactions successfully completed.</strong></div>';

                                                        }).catch(function (response) {
                                                            if (response.status === 403) {
                                                                self.save();
                                                            }
                                                            document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in receiver balance.</strong></div>';
                                                        });
                                                    }).catch(function (response) {
                                                        if (response.status === 403) {
                                                            self.save();
                                                        }
                                                        document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in fetching receiver balance.</strong></div>';
                                                    });
                                            }).catch(function (response) {
                                                if (response.status === 403) {
                                                    self.save();
                                                }
                                                document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in Receiver transaction.</strong></div>';
                                            });
                                        }).catch(function (response) {
                                            if (response.status === 403) {
                                                self.save();
                                            }
                                            document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in fetching receiver Id.</strong></div>';
                                        });

                                }).catch(function (response) {
                                    if (response.status === 403) {
                                        self.save();
                                    }
                                    document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in sender balance.</strong></div>';
                                });
                            }).catch(function (response) {
                                if (response.status === 403) {
                                    self.save();
                                }
                                document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in sender transaction.</strong></div>';
                            });
                        }
                        else {
                            document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>You don\'t have enough bank balance to perform this transaction.</strong></div>';
                        }
                    })
                    .catch(function (response) {
                        if (response.status === 403) {
                            self.save();
                        }
                        document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in processing transaction, Please check your transaction data.</strong></div>';
                        console.log('Error fetching user data:', error);
                    });
            }
        }
        self.init();
    }

    // Define the TransactionController and inject dependencies
    angular.module("bank-fe").controller('TransactionController', ['TransactionService', 'AccountService', 'BalanceService', '$routeParams', '$http', '$location', '$scope', 'SharedDataService', TransactionController]);
}());
