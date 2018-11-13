Session.set('data_loaded', false); 

var reportsHandle = Meteor.subscribe('reports', function () {
  Session.set('data_loaded', true); 
});

var screenshotsHandle = Meteor.subscribe('screenshots', function () {
});

Deps.autorun(function(){
  var userDataHandle  = Meteor.subscribe('userData', function () {
  });
});

