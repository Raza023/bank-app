
(function () {
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
                params: { userId: '@userId' }
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

    function BankService3($resource) {
        return $resource('/api/v1/bankAccount/all/', {}, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
                //                    isArray: true // Add this line to handle array response
            },
            save: {
                method: 'POST'
            },
            remove: {
                method: 'DELETE'
            }
        });
    }

    angular.module('bank-fe').factory('BankService3', ['$resource', BankService3]);

    function BankService4($resource) {
        return $resource('/api/v1/bankBalance/:id', { id: '@id' }, {
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

    angular.module('bank-fe').factory('BankService4', ['$resource', BankService4]);

    function BankService5($resource) {
        return $resource('/api/v1/bankBalance/balance/:userId', {}, {
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
                method: 'DELETE',
                params: { userId: '@userId' }
            }
        });
    }

    angular.module('bank-fe').factory('BankService5', ['$resource', BankService5]);

    angular.module('bank-fe').factory('SharedDataService', function () {
        var self = this;
        self.sharedData = {};
        self.sharedData.bankItem = {};
        self.sharedData.loggedInUser = {};
        self.sharedData.balance = {};
        self.sharedData.balanceId = 1;
        self.sharedData.transactions = [];
        self.sharedData.displayTrans = false;

        self.sharedData.pass = false;
        self.sharedData.fail = false;
        self.sharedData.passmessage = "";
        self.sharedData.failmessage = "";

        return this;
    });

    function BankController(BankService, BankService2, BankService3, BankService4, BankService5, $routeParams, $http, $location, $scope, SharedDataService) {
        var self = this;

        //        document.getElementById("#showMesssage").innerText = "";

        self.currentUrl = "";

        self.service = BankService;
        self.service2 = BankService2;
        self.service3 = BankService3;
        self.service4 = BankService4;
        self.service5 = BankService5;
        self.bank = [];
        self.title = '';
        self.display = false;
        self.displayTrans = SharedDataService.sharedData.displayTrans;
        self.transactions = SharedDataService.sharedData.transactions;
        self.bankItem = SharedDataService.sharedData.bankItem;
        self.loggedInUser = SharedDataService.sharedData.loggedInUser; // Add a property for the logged-in user
        self.balanceId = SharedDataService.sharedData.balanceId;
        self.balance = SharedDataService.sharedData.balance; // Add a property for the logged-in user

        self.pass = SharedDataService.sharedData.pass;
        self.fail = SharedDataService.sharedData.fail;
        self.passmessage = SharedDataService.sharedData.passmessage;
        self.failmessage = SharedDataService.sharedData.failmessage;


        self.init = function () {
            self.search();

            self.currentUrl = $location.absUrl();

            if (self.currentUrl.endsWith("#!/bank")) {
                SharedDataService.sharedData.bankItem = {};
                self.bankItem = SharedDataService.sharedData.bankItem;
            }
            else {
                //                console.log("URL ends with #!/bank");

                const storedData = JSON.parse(localStorage.getItem('myBankItem'));

                //                console.log(storedData);

                if (storedData) {
                    SharedDataService.sharedData.bankItem = storedData;
                    self.bankItem = SharedDataService.sharedData.bankItem;
                }
            }



            $http.get('/api/v1/bankAccount/auth')
                .then(function (response) {
                    // Assuming the user data is available in the response.data
                    self.loggedInUser = response.data.content;
                    SharedDataService.sharedData.loggedInUser = self.loggedInUser; // Update the shared data
                    if (response.data.content !== null) {
                        self.balanceId = response.data.content.id;
                    }
                    SharedDataService.sharedData.balanceId = self.balanceId; // Update the shared data
                    //                console.log(response.data.content);
                    //                console.log(response.data.content.id);
                    //                console.log(self.balanceId);
                    $http.get('/api/v1/bankBalance/balance/' + self.balanceId)
                        .then(function (response) {
                            // Assuming the user data is available in the response.data
                            self.balance = response.data.content;
                            SharedDataService.sharedData.balance = self.balance; // Update the shared data
                            //                    console.log(response.data.content);
                        })
                        .catch(function (error) {
                            console.log('Error fetching user data:', error);
                        });
                })
                .catch(function (error) {
                    console.log('Error fetching user data:', error);
                });

            //            console.log(SharedDataService.sharedData.balanceId);
            //            console.log(self.balanceId);
        }

        self.search = function () {
            self.display = false;
            var parameters = {};
            if (self.title) {
                parameters.title = '%' + self.title + '%';
            }
            else {
                parameters.title = '%';
            }

            self.service.get(parameters).$promise.then(function (response) {
                self.display = true;
                self.bank = response.content;
            });
        }

        //        self.checkUserNameExist(response)
        //        {
        //            let data = response.data;
        //
        //            for(let i = 0; i < data.length; i++)
        //            {
        //                console.log(data[i].name+i);
        //            }
        //        }

        self.save = function () {
            if (!self.bankItem.password.startsWith("{noop}")) {
                self.bankItem.password = "{noop}" + self.bankItem.password;
            }

            var isExist = false;

            self.service3.get().$promise.then(function (response) {
                console.log(response.content);

                let myData = response.content;

                isExist = false;

                for (let i = 0; i < myData.length; i++) {
                    if (myData[i].name === self.bankItem.name || myData[i].email === self.bankItem.email) {
                        isExist = true;
                        break;
                    }
                }

                //                console.log(self.bankItem.id+"check");

                if (self.bankItem.id) {
                    self.service.save(self.bankItem).$promise.then(function (response) {
                        self.bankItem.id = response.content.id;

                        console.log("account update");

                        document.getElementById("showMesssage").innerHTML = '<div class="alert alert-success"><strong>Account updated successfully.</strong></div>';
                    }).catch(function (response) {
                        if (response.status === 403) {
                            self.save();
                        }
                        document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in updating account.</strong></div>';
                    });
                }
                else {
                    console.log("account create");

                    if (isExist) {
                        document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Username or email already exist.</strong></div>';
                    }
                    else {
                        self.service.save(self.bankItem).$promise.then(function (response) {
                            self.bankItem.id = response.content.id;

                            self.balance = {};

                            self.balance.amount = 0;
                            self.balance.userId = self.bankItem.id;

                            console.log("created user ID: " + self.balance.userId);

                            self.service4.save(self.balance).$promise.then(function (response) {
                                self.balance.id = response.content.id;
                                self.balance.lastTransaction = response.content.lastTransaction;
                                self.balance.date = response.content.date;

                                console.log(self.balance);

                                document.getElementById("showMesssage").innerHTML = '<div class="alert alert-success"><strong>Account saved successfully.</strong></div>';
                            }).catch(function (response) {
                                if (response.status === 403) {
                                    self.save();
                                }
                                document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in creating account balance.</strong></div>';
                            });
                        }).catch(function (response) {
                            if (response.status === 403) {
                                self.save();
                            }
                            document.getElementById("showMesssage").innerHTML = '<div class="alert alert-danger"><strong>Error in creating account.</strong></div>';
                        });
                    }
                }
            }).catch(function (response) {
                console.log('Error fetching Accounts:', response);
                if (response.status === 403) {
                    self.save();
                }
            });
        }

        self.showToUpdate = function (item) {

            self.bankItem.id = item.id;
            self.bankItem.name = item.name;
            self.bankItem.password = item.password;
            self.bankItem.roles = item.roles;
            self.bankItem.email = item.email;
            self.bankItem.address = item.address;

            SharedDataService.sharedData.bankItem = self.bankItem;

            localStorage.setItem('myBankItem', JSON.stringify(self.bankItem));

            $location.path('/bank/' + item.id); // Update the URL to include the item's ID

            //            console.log(self.bankItem);
        };

        self.showTransactions = function (item) {
            console.log(item.userId);

            self.service2.get({ userId: item.userId }).$promise
                .then(function (response) {

                    self.displayTrans = true;
                    SharedDataService.sharedData.displayTrans = self.displayTrans;

                    self.transactions = response.content;
                    SharedDataService.sharedData.transactions = self.transactions;

                    console.log(self.displayTrans);
                    console.log(self.transactions);

                    $location.path('/showTransactions/' + item.userId);
                })
                .catch(function (error) {
                    console.log('Error fetching user data:', error);
                });
        }

        self.delete = function (item) {
            self.display = false;
            self.bankItem = item;
            if (self.bankItem.id) {

                var deletedUserId = self.bankItem.id;

                self.service.delete({ id: self.bankItem.id }).$promise.then(function (deleteResponse) {
                    self.display = true;
                    self.bank = deleteResponse.content;

                    self.service5.delete({ userId: self.bankItem.id }).$promise.then(function (accDeleteResponse) {
                        console.log(accDeleteResponse);
                        console.log("Account also deleted.");
                    }).catch(function (response) {
                        if (response.status === 403) {
                            self.delete(item);
                        }
                    });
                }).catch(function (response) {
                    if (response.status === 403) {
                        self.delete(item);
                    }
                });
            } else {
                console.log('Invalid id for deletion.');
            }
        }

        self.init();
    }

    angular.module("bank-fe").controller('BankController', ['BankService', 'BankService2', 'BankService3', 'BankService4', 'BankService5', '$routeParams', '$http', '$location', '$scope', 'SharedDataService', BankController]);

}());