(function() {
    'use strict';



    function BankConfig($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.when('/login', {
            templateUrl: 'signing/login.html',
            controller: 'SigningController as $ctrl'
        }).when('/logout', {
            templateUrl: 'signing/logout.html',
            controller: 'SigningController as $ctrl'
        }).when('/bank', {
            templateUrl: 'bank/bank.html',
            controller: 'BankController as $ctrl',
            resolve: {
              checkAdmin: ['$q', 'AuthService', '$location', function ($q, AuthService, $location) {
                var loginPromise = AuthService.isLoggedIn();
                var adminPromise = AuthService.isAdmin();

                return $q.all([loginPromise, adminPromise]).then(function(results) {
                  var loginVar = results[0];
                  var adminVar = results[1];

                  if (loginVar) {
                    if(adminVar)
                    {
                        // Both conditions are met, resolve the route
                        console.log("you are admin.");
                        return true;
                    }
                    else
                    {
                        console.log("You are not an admin.");
                        $location.path('/account'); // Redirect to the login page
                        return $q.reject("Access denied");
                    }
                  } else {
                    // Either condition is not met, reject the route
                    console.log("login require.");
                    $location.path('/login'); // Redirect to the login page
                    return $q.reject("Access denied");
                  }
                }).catch(function (error) {
                  // Handle errors if necessary
                  console.log("There was an error.");
                  $location.path('/login'); // Redirect to an error page
                  return $q.reject(error);
                });
              }]
            }
        }).when('/bank/:id', {
            templateUrl: 'bank/bank.html',
            controller: 'BankController as $ctrl',
            resolve: {
              checkAdmin: ['$q', 'AuthService', '$location', function ($q, AuthService, $location) {
                var loginPromise = AuthService.isLoggedIn();
                var adminPromise = AuthService.isAdmin();

                return $q.all([loginPromise, adminPromise]).then(function(results) {
                  var loginVar = results[0];
                  var adminVar = results[1];

                  if (loginVar) {
                    if(adminVar)
                    {
                        // Both conditions are met, resolve the route
                        console.log("you are admin.");
                        return true;
                    }
                    else
                    {
                        console.log("You are not an admin.");
                        $location.path('/account'); // Redirect to the login page
                        return $q.reject("Access denied");
                    }
                  } else {
                    // Either condition is not met, reject the route
                    console.log("login require.");
                    $location.path('/login'); // Redirect to the login page
                    return $q.reject("Access denied");
                  }
                }).catch(function (error) {
                  // Handle errors if necessary
                  console.log("There was an error.");
                  $location.path('/login'); // Redirect to an error page
                  return $q.reject(error);
                });
              }]
            }
        }).when('/search', {
            templateUrl: 'bank/search.html',
            controller: 'BankController as $ctrl',
            resolve: {
              checkAdmin: ['$q', 'AuthService', '$location', function ($q, AuthService, $location) {
                var loginPromise = AuthService.isLoggedIn();
                var adminPromise = AuthService.isAdmin();

                return $q.all([loginPromise, adminPromise]).then(function(results) {
                  var loginVar = results[0];
                  var adminVar = results[1];

                  if (loginVar) {
                    if(adminVar)
                    {
                        // Both conditions are met, resolve the route
                        console.log("you are admin.");
                        return true;
                    }
                    else
                    {
                        console.log("You are not an admin.");
                        $location.path('/account'); // Redirect to the login page
                        return $q.reject("Access denied");
                    }
                  } else {
                    // Either condition is not met, reject the route
                    console.log("login require.");
                    $location.path('/login'); // Redirect to the login page
                    return $q.reject("Access denied");
                  }
                }).catch(function (error) {
                  // Handle errors if necessary
                  console.log("There was an error.");
                  $location.path('/login'); // Redirect to an error page
                  return $q.reject(error);
                });
              }]
            }

//            resolve: {
//                checkAdmin: ['$q', 'AuthService', '$location', function ($q, AuthService, $location) {
//                    // Create a deferred object inside the resolve function
////                    var deferred = $q.defer();
//
//                    var loginUser = AuthService.isLoggedIn();
//                    console.log(loginUser);
//
//                    var adminUser = AuthService.isAdmin();
//                    console.log(adminUser);
//
//
//                    var loginVar = false;
//                    var adminVar = false;
//
//                    loginUser.then(function(result) {
//                      loginVar = result;
//                      console.log(loginVar);
//                    }).catch(function (error) {
//                        loginVar = false;
//                        console.log(loginVar);
//                    });
//
//                    adminUser.then(function(result) {
//                      adminVar = result;
//                      console.log(adminVar);
//                    }).catch(function (error) {
//                      adminVar = false;
//                      console.log(adminVar);
//                    });




//                    AuthService.isLoggedIn()
//                        .then(function (loginChecking) {
//                            console.log("Login Checking" + loginChecking);
//                            if (loginChecking) {
//                                console.log("User is logged in");
//
//                                AuthService.isAdmin()
//                                    .then(function (adminChecking) {
//                                        console.log("Admin Checking" + adminChecking);
//                                        if (adminChecking) {
//                                            console.log("You are an admin.");
//                                            // Resolve the promise here when user is an admin
//                                            deferred.resolve();
//                                            $location.path('/search');
//                                        } else {
//                                            console.log("User is not an admin, redirecting to account page");
//                                            // Reject the promise and redirect to the account page
//                                            deferred.reject();
//                                            $location.path('/account');
//                                        }
//                                    })
//                                    .catch(function (error) {
//                                        console.error('Authentication error:', error);
//                                        // Reject the promise in case of an error
//                                        deferred.reject();
//                                    });
//                            } else {
//                                console.log("User is not logged in, redirecting to login page");
//                                // Reject the promise and redirect to the login page
//                                deferred.reject();
//                                $location.path('/login');
//                            }
//                        })
//                        .catch(function (error) {
//                            console.error('Authentication error:', error);
//                            // Reject the promise in case of an error
//                            deferred.reject();
//                        });
//
//                    // Return the promise
//                    return deferred.promise;
//                }]
//            }
        })
        .when('/account', {
            templateUrl: 'account/account.html',
            controller: 'BankController as $ctrl',
            resolve: {
              checkAdmin: ['$q', 'AuthService', '$location', function ($q, AuthService, $location) {
                var loginPromise = AuthService.isLoggedIn();
//                var adminPromise = AuthService.isAdmin();

                return $q.all([loginPromise]).then(function(results) {
                  var loginVar = results[0];
//                  var adminVar = results[1];

                  if (loginVar) {
                    //User is logged in.
                    return true;
                  } else {
                    // condition is not met, reject the route
                    console.log("login require.");
                    $location.path('/login'); // Redirect to the login page
                    return $q.reject("Access denied");
                  }
                }).catch(function (error) {
                  // Handle errors if necessary
                  console.log("There was an error.");
                  $location.path('/login'); // Redirect to an error page
                  return $q.reject(error);
                });
              }]
            }
        }).when('/showTransactions/:id', {
          templateUrl: 'account/showTransactions.html',
          controller: 'BankController as $ctrl',
          resolve: {
            checkAdmin: ['$q', 'AuthService', '$location', function ($q, AuthService, $location) {
              var loginPromise = AuthService.isLoggedIn();
//              var adminPromise = AuthService.isAdmin();

              return $q.all([loginPromise]).then(function(results) {
                var loginVar = results[0];
//                var adminVar = results[1];

                if (loginVar) {
                  //User is logged in.
                  return true;
                } else {
                  // condition is not met, reject the route
                  console.log("login require.");
                  $location.path('/login'); // Redirect to the login page
                  return $q.reject("Access denied");
                }
              }).catch(function (error) {
                // Handle errors if necessary
                console.log("There was an error.");
                $location.path('/login'); // Redirect to an error page
                return $q.reject(error);
              });
            }]
          }
        }).when('/transaction', {
            templateUrl: 'account/transaction.html',
            controller: 'TransactionController as $ctrl',
            resolve: {
              checkAdmin: ['$q', 'AuthService', '$location', function ($q, AuthService, $location) {
                var loginPromise = AuthService.isLoggedIn();
//                var adminPromise = AuthService.isAdmin();

                return $q.all([loginPromise]).then(function(results) {
                  var loginVar = results[0];
//                  var adminVar = results[1];

//                    console.log(loginVar);

                  if (loginVar) {
                    //User is logged in.
                    return true;
                  } else {
                    // condition is not met, reject the route
                    console.log("login require.");
                    $location.path('/login'); // Redirect to the login page
                    return $q.reject("Access denied");
                  }
                }).catch(function (error) {
                  // Handle errors if necessary
                  console.log("There was an error.");
                  $location.path('/login'); // Redirect to an error page
                  return $q.reject(error);
                });
              }]
            }
        }).otherwise('/search');
    }

    angular.module('bank-fe', ['ngRoute', 'ngResource', 'ng'])
        .config(['$locationProvider', '$routeProvider', BankConfig]);

    angular.module('bank-fe')
        .factory('AuthService', ['$http', '$q', function ($http, $q) {
            var authenticatedUser = null;
            var auser = null;
            var adminbhai = false;

            return {
                authenticateUser: function () {
                    // Fetch authenticated user data
                    var self = this;

                        return $http.get('/api/v1/bankAccount/auth')
                        .then(function (response) {
                            console.log(response);
                            if(response.data.content !== null)
                            {
                                // Assuming the user data is available in the response.data
                                authenticatedUser = response.data.content.name;
        //                            console.log(response);
                                console.log(authenticatedUser + " string");
        //                            value = authenticatedUser;
                                return authenticatedUser;
                            }
                            else
                            {
                                console.log('Error fetching user data:');
                                return $q.reject("ACCESS DENIED");
                            }
                        })
                        .catch(function (error) {
                            console.log('Error fetching user data:', error);
                            return $q.reject(error);
                        });
                },
                isLoggedIn: function () {
                    if (authenticatedUser !== null) {
                        return true;
                    } else {
                        return this.authenticateUser()
                            .then(function (auser) {
//                                console.log(auser);
                                return auser !== null;
                            })
                            .catch(function (error) {
                                console.log('Authentication error:', error);
                                return false;
                            });
                    }
                },
                isAdmin: function () {
                    // Assuming this.authenticateUser() returns a Promise
                    return this.authenticateUser()
                        .then(function (auser) {
                            // Make sure auser is correctly received
//                            console.log(auser);

                            if (authenticatedUser !== null && auser === "admin") {
//                                console.log(auser);
                                return true;
                            } else {
                                return false;
                            }
                        })
                        .catch(function (error) {
                            console.log('Authorization error:', error);
                            return false;
                        });
                }
            };
        }]);
}());