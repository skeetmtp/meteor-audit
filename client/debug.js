
Template.debug.helpers({
  getReports : function() {
    return Reports.find({}, {sort: {createdAt: -1}} );
  },
  getUsers : function() {
    return Meteor.users.find({});
  },
});

Template.debug.events({
  'click #submitButton': function () {
    var url = $('#url').val();
    var loginToken = $('#loginToken').val();
    //console.log("url >", url);
    //console.log("loginToken >", loginToken);
    Meteor.call('initReport', url, loginToken, function(err, response) { 
      //console.log("result", err, response);
    });
  },
  'click #testCreateButton': function () {
    console.log("testCreateButton");
    Meteor.call('initReport', "http://localhost:3000/", null, function(err, response) { 
      if(response) {
        //Router.go('/report/' + response);
      } 
      //console.log("result", err, response);
    });
  },
  'click #testStartButton': function () {
    //console.log("testStartButton");
    var entry = Reports.findOne();
    Meteor.call('refreshReport', entry._id, function(err, response) { 
      //console.log("result", err, response);
    });
  },
});



Template.debugUser.helpers({
  userName : function() {
    var user = this;
    if(user.profile === undefined || user.profile.name === undefined)
    {
      return '"' + user._id + '"'; 
    }
    return user.profile.name;
  },
});


Template.debugItem.events({
  'click #refreshButton': function () {
    var self = this;
    //console.log("refresh >", self);
    Meteor.call('refreshReport', self._id, function(err, response) { 
      //console.log("result", err, response);
    });
  },
  'click #goButton': function () {
    var url = this.url;
    //console.log("go >", url);
    Router.go('/report/' + this._id);
  },
  'click #debugButton': function () {
    var url = this.url;
    //console.log("debug >", url);
    Router.go('/reportError/' + this._id);
  },
  'click #deleteButton': function () {
    var url = this.url;
    //console.log("delete >", url);
    Reports.remove(this._id);
  },
  'click #setPublicButton': function () {
    var self = this;
    //console.log("setPublic >", self);
    Meteor.call('setPublic', self._id, true, function(err, response) { 
      //console.log("result", err, response);
    });
  },
  'click #unsetPublicButton': function () {
    var self = this;
    //console.log("unsetPublicButton >", self);
    Meteor.call('setPublic', self._id, false, function(err, response) { 
      //console.log("result", err, response);
    });
  },
  'click #setDemoButton': function () {
    var self = this;
    //console.log("setDemo >", self);
    Meteor.call('setDemo', self._id, true, function(err, response) { 
      //console.log("result", err, response);
    });
  },
  'click #unsetDemoButton': function () {
    var self = this;
    //console.log("unsetDemo >", self);
    Meteor.call('setDemo', self._id, false, function(err, response) { 
      //console.log("result", err, response);
    });
  },
});

Template.debugItem.helpers({
  dataStatus: function() {
    var self = this;
    if( self.receivedData === true) {
      return "data_ok";
    } else {
      return "no_data";
    }
  },
  getLastScanDate: function() {
    var self = this;
   return moment(self.lastScanDate).calendar();
  },
  isDataOk: function() {
    var self = this;
    return self.receivedData === true;
  },
  userName : function() {
    var self = this;
    var user = Meteor.users.findOne(self.createdBy);
    if(user === undefined || user.profile === undefined || user.profile.name === undefined)
    {
      return '"' + self.createdBy + '"'; 
    }
    return user.profile.name;
  },
});
