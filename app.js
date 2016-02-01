'use strict';

var app = angular.module("myApp", ["ngRoute", "firebase"]);

var firebase_URL = "https://assignmetn1-app.firebaseio.com/";
var refDB = new Firebase(firebase_URL);

var user_table = "users";
var review_table = "reviews";
var wishlist_table = "wishlists";

//app.config(function($routeProvider, $locationProvider){
//    $routeProvider
//    .when('/', {
//        templateUrl: 'views/landing.html',
//    })
//    .when('/login', {
//        templateUrl: 'views/login.html',
//    })
//    .when('/products', {
//        template: 'products.html',
//    })
//    .when('/prod_desc/:prodId', {
//        templateUrl: 'views/prod_desc.html',
//        controller: 'ProductController'
//    })
//    .otherwise({ redirectTo: '/' });
////    $locationProvider.html5Mode({
////        enabled: true,
////        requireBase: false
////    });
//});

var currentUser = refDB.getAuth();
if (currentUser) {
    // console.log(JSON.stringify(currentUser));
} else {
    console.log("User is logged out");
    currentUser === null;
}


app.service('authUser', function() {
    var user = '';
    var email = '';
    return {
        getUser: function(){
            return user;
        },
        setUser: function(value){
            user = value;
        },
        getUserEmail: function(){
            return email;
        },
        setUserEmail: function(value){
            email = value;
        }
    };
});
app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
});
app.controller('mainCtrl', ["$scope", "$firebase", "$firebaseObject", "authUser", "$filter", "$firebaseArray",
                            function($scope, $firebase, $firebaseObject, authUser, $filter, $firebaseArray) {
    authUser.setUser(currentUser === null ? "" : currentUser.uid );
    authUser.setUserEmail(currentUser === null ? "" : currentUser.password.email );
    $scope.loggedUser = authUser.getUser();
    $scope.loggedUserEmail = authUser.getUserEmail();
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

    $scope.addReview = function(pid, user){
        var userId = $scope.user.uid;
        var userName = user.email.replace(/@.*/, '');
        var comment = $scope.review.comment;
        var datetime = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
        var randomRoomId = Math.round(Math.random() * 1000000000);
        var prodId = pid;
        var rating = $scope.review.rating;
        refDB.child(review_table).child(prodId).child(randomRoomId).set({
            userid: userId,
            userName: userName,
            prodId: prodId,
            comment: comment,
            rating: rating,
            created_on: datetime
        });
    };
    $scope.getAllReviews = function(pid){
        var messagesRef = new Firebase(firebase_URL + review_table + '/' + pid);
        // download the data from a Firebase reference into a (pseudo read-only) array
        // all server changes are applied in realtime
        $scope.reviews = $firebaseArray(messagesRef);
        // create a query for the most recent 25 messages on the server
        // var query = messagesRef.orderByChild("created_on");
        // the $firebaseArray service properly handles database queries as well
        // $scope.filteredReviews = $firebaseArray(query);
//        console.log($scope.filteredReviews);
    };
    $scope.addWishlist = function(uid, pid){
        var userId = uid;
        // var userName = email.replace(/@.*/, '');
        var datetime = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
        var randomRoomId = Math.round(Math.random() * 1000000000);
        var isFulfilled = 0;
        refDB.child(wishlist_table).child(uid).child(randomRoomId).set({
            userid: userId,
            // userName: userName,
            prodId: pid,
            isFulfilled: isFulfilled,
            created_on: datetime
        });
    };
    $scope.getWishlist = function(user){
        var userId = user;
        var messagesRef = new Firebase(firebase_URL + wishlist_table + '/' + userId);
        // download the data from a Firebase reference into a (pseudo read-only) array
        // all server changes are applied in realtime
        $scope.wishlists = $firebaseArray(messagesRef);
        // console.log($scope.wishlists);
        // create a query for the most recent 25 messages on the server
        // var query = messagesRef.orderByChild("created_on");
        // the $firebaseArray service properly handles database queries as well
        // $scope.filteredWishlist = $firebaseArray(query);
        // console.log($scope.filteredWishlist);
    };
    $scope.wishFulfil = function(user, rId){

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
            location.href = 'index.html';
        }
    });

};

