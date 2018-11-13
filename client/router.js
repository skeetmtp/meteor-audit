Router.configure({
  layoutTemplate: 'layout',
});

Router.map(function() {

  this.route('/', function() {
    this.render('home', {
      waitOn: function() { return Meteor.subscribe('reports')},
      data: function() { 
        var userId = Meteor.userId();
        //return Reports.find({createdBy : userId}, {sort: {createdAt: -1}} ); 
        return Reports.find({}); 
      },
    });
  });

  this.route('/report/:_id', function () {
    this.render('report', {
      waitOn: function() { return Meteor.subscribe('reports', { entryId : this.params._id } ) },
      data: function() { return Reports.findOne(this.params._id); },
    });
  });

  this.route('/reportError/:_id', function() {
    this.render('reportError', {
      waitOn: function() { return Meteor.subscribe('reports', { selector : { _id : this.params._id } } ) },
      data: function() { return Reports.findOne(this.params._id); },
    });
  });

  this.route('/debug', function() {
    this.render('debug', {
      waitOn: function() { return Meteor.subscribe('reports', { selector : { }, options : { sort: {createdAt: -1} , limit : 10 } })},
      data: function() { return Reports.find({}, { sort: {createdAt: -1} }); },
    });
  });

  this.route('debug/last', function() {
    this.render('debug', {
      waitOn: function() { return Meteor.subscribe('reports', { selector : { }, options : { sort: {lastScanDate: -1} , limit : 10 } })},
      data: function() { return Reports.find({}, { sort: {lastScanDate: -1} }); },
    });
  });

  this.route('debug/:_userid', function() {
    this.render('debug', {
      waitOn: function() { return Meteor.subscribe('reports', { selector : { createdBy : this.params._userId } } ) },
      data: function() { return Reports.find({}, { sort: {lastScanDate: -1} }); },
    });
  });

  this.route('/demo', function() {
    this.render('demo', {
      layoutTemplate: 'demoLayout', 
      waitOn: function() { return Meteor.subscribe('reports')},
      data: function() { return Reports.findOne({isDemo : true}); },
    });
  });

  this.route('/help/logintoken', function() {
    this.render('helplogintoken');
  });

  this.route('/about', function() {
    this.render('about');
  });

});


