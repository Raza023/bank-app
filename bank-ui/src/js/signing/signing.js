(function() {
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

        self.login = function() {
            $http.post('login',
                'username=' + self.user.name + '&password=' + self.user.password, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(self.loginSuccess, self.loginFailure);
        }

        self.loginSuccess = function(response) {

            self.pass = true;
            SharedDataService.sharedData.pass = self.pass;
            self.fail = false;
            SharedDataService.sharedData.fail = self.fail;
            self.passmessage = "Successfully logged in";
            SharedDataService.sharedData.passmessage = self.passmessage;
            self.failmessage = "";
            SharedDataService.sharedData.failmessage = self.failmessage;

            if(self.user.name === "admin" && self.user.password === "admin")
            {
                $location.path('/search');
            }
            else
            {
                $location.path('/account');
            }
        }

        self.loginFailure = function(response) {

            self.pass = false;
            SharedDataService.sharedData.pass = self.pass;
            self.fail = true;
            SharedDataService.sharedData.fail = self.fail;
            self.passmessage = "";
            SharedDataService.sharedData.passmessage = self.passmessage;
            self.failmessage = "Error in logging in";
            SharedDataService.sharedData.failmessage = self.failmessage;
            self.user.error = response.data;

            console.log(response);

            if (response.data === null) {
                self.pass = false;
                SharedDataService.sharedData.pass = self.pass;
                self.fail = true;
                SharedDataService.sharedData.fail = self.fail;
                self.passmessage = "";
                SharedDataService.sharedData.passmessage = self.passmessage;
                self.failmessage = "Invalid username and password.";
                SharedDataService.sharedData.failmessage = self.failmessage;

                self.user.error = response.data;
            }
            if (response.status === 403) {
                self.login();
            }
            else
            {
                $location.path('/login');
            }
        }

        self.logout = function() {
            $http.post('logout').then(self.logoutSuccess, self.logoutFailure);
        }

        self.logoutSuccess = function(response) {

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

        self.logoutFailure = function(response) {

            self.pass = false;
            SharedDataService.sharedData.pass = self.pass;
            self.fail = true;
            SharedDataService.sharedData.fail = self.fail;
            self.passmessage = "";
            SharedDataService.sharedData.passmessage = self.passmessage;
            self.failmessage = "Error in logging out";
            SharedDataService.sharedData.failmessage = self.failmessage;

            self.user.error = response.data;
            if(response.status === 403){
                self.logout();
            }
            else
            {
                $location.path('/logout');
            }
        }
    }

    angular.module('bank-fe').controller('SigningController', ['$http', '$location', 'SharedDataService', SigningController]);

}());