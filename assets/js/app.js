'use strict';

var app = angular.module("myApp", ["firebase"]);

var firebase_URL = "https://assignmetn1-app.firebaseio.com/";
var refDB = new Firebase(firebase_URL);

var user_table = "users";

// app.config(['$routeProvider', function($routeProvider) {
//     $routeProvider
//         .when('/', {
//             templateUrl: "login.html",
//             controller: userCtrl
//         })
//         .when('/profile', {
//             templateUrl: "profile.html",
//             controller: userCtrl,
//         })
//         .otherwise({ redirectTo: '/' });
// }]);

var currentUser = refDB.getAuth();
if (currentUser) {
    // console.log(JSON.stringify(currentUser));
} else {
    console.log("User is logged out");
}

app.service('authUser', function() {
    var user = '';
    return {
        getUser: function(){
            return user;
        },
        setUser: function(value){
            user = value;
        }
    };
});

app.controller('userCtrl', ["$scope", "$firebase", "$firebaseObject", "authUser", function($scope, $firebase, $firebaseObject, authUser) {
    authUser.setUser(currentUser === null ? "" : currentUser.uid );
    $scope.loggedUser = authUser.getUser();

    // login & auth user
    $scope.login = function(){
        console.log('User Login ...');
        userLogin($scope.login_email, $scope.login_password);
    }
    // create new user /sign up
    var newUser = {};
    $scope.registerUser = function() {
        console.log('register user!');
        newUser = {
            email: $scope.reg_email,
            password: $scope.reg_password,
            displayName: $scope.reg_username
        };
        // create user & user profile
        createUser(newUser);
    };  

    $scope.logout = function(){
        refDB.unauth();
        console.log("User logout...");
        location.href = "index.html";
    };

    $scope.user_profile = function (id){
        $scope.user = {};
        $scope.user = $firebaseObject(refDB.child(user_table).child(id));
    };
}]);

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function createUser(newUser){
    refDB.createUser({
      email: newUser.email,
      password: newUser.password
    }, function(error, userData) {
      if (error) {
        switch (error.code) {
          case "EMAIL_TAKEN":
            console.log("The new user account cannot be created because the email is already in use.");
            break;
          case "INVALID_EMAIL":
            console.log("The specified email is not a valid email.");
            break;
          default:
            console.log("Error creating user:", error);
        }
      } else {
        // console.log("Successfully created user account with uid:", userData.uid);
        console.log("Successfully created user account with email: ", newUser.email);
      }
    });
}

function userLogin(user_email, user_password) {
    console.log('User email: ' + user_email);
    console.log('User password: ' + user_password);
    refDB.authWithPassword({
        email: user_email,
        password: user_password
    }, function(error, authData) {
        remember: "sessionOnly"
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
            refDB.onAuth(function(authData) {
              if (authData) {
                // save the user's profile into the database so we can list users,
                // use them in Security and Firebase Rules, and show profiles
                refDB.child(user_table).child(authData.uid).set({
                    provider: authData.provider,
                    uid: authData.uid,
                    name: authData.password.email.replace(/@.*/, ''),
                    email: authData.password.email
                });
              }
            });
            location.href = 'profile.html';        
        }
    });
    
};

