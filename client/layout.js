var isInDevelopment = function() {
  var rootUrl = Meteor.absoluteUrl();
  return rootUrl === "http://localhost:3000/"
    || rootUrl === "http://scan.meteor.com/"
}

var isInProduction = function() {
  return !isInDevelopment();
}


Template.layout.events({
  'click #loginButton': function () {
    if (isInDevelopment()) {
      Meteor.loginWithPassword("toto@toto.fr", "totototo", function(err) {});
    }
    else {
      Meteor.loginWithMeteorDeveloperAccount({}, function(err) {});
    }
  }
});



Template.layout.helpers({
  isInDevelopment : function()  {
    return isInDevelopment();
  },
  isInProduction : function()  {
    return isInProduction();
  },
  isLogged  : function() {
    if(Meteor.userId()) {
      return true;
    }
    return false;
  },
});



Template.logout.events({
  'click #logoutButton': function () {
      Meteor.logout(function(err) {});
  }
});
