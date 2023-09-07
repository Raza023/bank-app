(function() {
    'use strict';

    function SigningController($http, $location) {
        var self = this;
        self.user = {};
//        self.logoutstatus = false;
//        self.loginstatus = false;

        self.login = function() {
            $http.post('login',
                'username=' + self.user.name + '&password=' + self.user.password, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(self.loginSuccess, self.loginFailure);
        }

        self.loginSuccess = function(response) {
//            self.loginstatus = true;
//            self.user.pass = "Successfully logged in.";
//            console.log(self.user.name);
//            console.log(self.user.password);

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
//            self.loginstatus = false;
            self.user.error = response.data;
//            if (response.status === -1) {
//                document.getElementById("loginInvalidError").innerHTML = "Username or Password Invalid!";
//            }
            if (response.status === 403) {
                self.login();
            }
        }

        self.logout = function() {
            $http.post('logout').then(self.logoutSuccess, self.logoutFailure);
        }

        self.logoutSuccess = function(response) {
//            self.logoutstatus = true;
//            self.user.pass = "Successfully logged out.";
            $location.path('/login');
        }

        self.logoutFailure = function(response) {
//            self.logoutstatus = false;
            self.user.error = response.data;
            if(response.status === 403){
                self.logout();
            }
        }
    }

    angular.module('bank-fe').controller('SigningController', ['$http', '$location', SigningController]);

}());