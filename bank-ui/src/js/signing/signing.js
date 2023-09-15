(function () {
    'use strict';

    function SigningController($http, $location, SharedDataService) {
        var self = this;
        self.user = {};
        //        self.logoutstatus = false;
        //        self.loginstatus = false;

        self.pass = SharedDataService.sharedData.pass;
        self.fail = SharedDataService.sharedData.fail;
        self.passmessage = SharedDataService.sharedData.passmessage;
        self.failmessage = SharedDataService.sharedData.failmessage;

        //        self.login = function() {
        //            $http.post('login',
        //                'userName=' + self.user.userName + '&password=' + self.user.password, {
        //                headers: {
        //                    "Content-Type": "application/x-www-form-urlencoded"
        //                }
        //            }).then(self.loginSuccess, self.loginFailure);
        //        }

        //        self.login = function() {
        //            // Send a POST request to authenticate and get the JWT token
        //            $http.post('/api/v1/bankAccount/authenticate', {
        //                userName:self.user.userName,
        //                password:self.user.password
        //            }).then(function(response) {
        //                // Assuming the JWT token is in the 'token' field of the response
        //                var token = response.data.content;
        //                console.log(response);
        //                console.log(token);
        //
        ////                self.loginSuccess();
        ////                 Store the token in local storage or a cookie for future use
        ////                 You should use a more secure way to store tokens in production
        ////
        ////                 Now, make the actual login request with the obtained token
        //                $http.post('login',
        //                    'userName=' + self.user.userName + '&password=' + self.user.password,
        //                {
        //                    headers: {
        //                        "Content-Type": "application/x-www-form-urlencoded",
        //                        "Authorization": "Bearer " + token
        //                    }
        //                }).then(self.loginSuccess, self.loginFailure);
        //            }).catch(self.loginFailure);
        //        }

        self.login = function () {
            $http.post('/api/v1/bankAccount/authenticate', {
                userName: self.user.userName,
                password: self.user.password
            }).then(function (response) {
                var token = response.data.content;
                console.log(response);
                console.log(token);



                if (token) {
                    // Store the token securely (e.g., using HttpOnly cookies)
                    // You may want to consider using a library like Angular's $cookies
                    // or an authentication library to handle token storage.
                    // Example using $cookies:
                    // $cookies.put('jwtToken', token); or sessionStorage

                    // Storing data in Session Storage
                    sessionStorage.setItem('jwtToken', token);

                    // Retrieving data from Session Storage
                    const myToken = sessionStorage.getItem('jwtToken');

                    $http.get('/api/v1/bankAccount', {
                        params: { title: self.user.userName },
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + myToken
                        }
                    }).then(function (response) {
                        console.log(response);
                        console.log(response.data.content[0].roles);

                        var role = response.data.content[0].roles;

                        sessionStorage.setItem('id', response.data.content[0].id);
                        sessionStorage.setItem('userName', response.data.content[0].userName);
                        sessionStorage.setItem('email', response.data.content[0].email);
                        sessionStorage.setItem('address', response.data.content[0].address);

                        if (role.includes('ADMIN')) {
                            sessionStorage.setItem('role', 'ADMIN');
                        }
                        else {
                            sessionStorage.setItem('role', 'USER');
                        }
                        self.loginSuccess();

                    })
                        .catch(function (error) {
                            console.log('Error fetching user data:', error);
                        });


                } else {
                    // Handle authentication failure

                    self.loginFailure();
                }
            }).catch(function (error) {
                // Handle authentication error

                self.loginFailure();
            });
        };

        //        // Accessing the JWT token in another controller
        //        var token = $cookies.get('jwtToken');
        //        if (token) {
        //            // You have the token, you can use it as needed
        //        } else {
        //            // Token not found, handle accordingly (e.g., redirect to login)
        //        }

        self.loginSuccess = function (response) {

            self.pass = true;
            SharedDataService.sharedData.pass = self.pass;
            self.fail = false;
            SharedDataService.sharedData.fail = self.fail;
            self.passmessage = "Successfully logged in";
            SharedDataService.sharedData.passmessage = self.passmessage;
            self.failmessage = "";
            SharedDataService.sharedData.failmessage = self.failmessage;

            const myRole = sessionStorage.getItem('role');

            // if (self.user.userName === "admin" && self.user.password === "admin") {
            //     $location.path('/search');
            // }
            // else {
            //     $location.path('/account');
            // }

            if (myRole === 'ADMIN') {
                $location.path('/search');
            }
            else {
                $location.path('/account');
            }
        }

        self.loginFailure = function (response) {

            self.pass = false;
            SharedDataService.sharedData.pass = self.pass;
            self.fail = true;
            SharedDataService.sharedData.fail = self.fail;
            self.passmessage = "";
            SharedDataService.sharedData.passmessage = self.passmessage;
            self.failmessage = "Error in logging in";
            SharedDataService.sharedData.failmessage = self.failmessage;
            // self.user.error = response;

            console.log(response);

            if (response === undefined) {
                self.pass = false;
                SharedDataService.sharedData.pass = self.pass;
                self.fail = true;
                SharedDataService.sharedData.fail = self.fail;
                self.passmessage = "";
                SharedDataService.sharedData.passmessage = self.passmessage;
                self.failmessage = "Invalid username and password.";
                SharedDataService.sharedData.failmessage = self.failmessage;

                // self.user.error = response;
            }

            $location.path('/login');
            // if (response.status === 403) {
            //     self.login();
            // }
            // else {
            //     $location.path('/login');
            // }
        }

        self.logout = function () {
            // $http.post('logout').then(self.logoutSuccess, self.logoutFailure);
            // Removing data from Session Storage
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('jwtToken');
            self.logoutSuccess();
        }

        self.logoutSuccess = function (response) {

            self.pass = true;
            SharedDataService.sharedData.pass = self.pass;
            self.fail = false;
            SharedDataService.sharedData.fail = self.fail;
            self.passmessage = "Successfully logged out";
            SharedDataService.sharedData.passmessage = self.passmessage;
            self.failmessage = "";
            SharedDataService.sharedData.failmessage = self.failmessage;

            $location.path('/login');
        }

        self.logoutFailure = function (response) {

            self.pass = false;
            SharedDataService.sharedData.pass = self.pass;
            self.fail = true;
            SharedDataService.sharedData.fail = self.fail;
            self.passmessage = "";
            SharedDataService.sharedData.passmessage = self.passmessage;
            self.failmessage = "Error in logging out";
            SharedDataService.sharedData.failmessage = self.failmessage;

            self.user.error = response.data;
            if (response.status === 403) {
                self.logout();
            }
            else {
                $location.path('/logout');
            }
        }
    }

    angular.module('bank-fe').controller('SigningController', ['$http', '$location', 'SharedDataService', SigningController]);

}());