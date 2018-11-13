
Template.report.helpers({
  isRequested: function() {
    if(this.status){
      return false;
    }
    return true;
  },

  isDone: function() {
    return this.status === "done";
  },

});



Template.reportIronRouter.helpers({
  routeHasOptions: function() {
    var self = this;
    //console.log(self);
    return self.options.data!==undefined && self.options.waitOn!=undefined;
  }
  ,
  routeCount: function() {
    var self = this;
    return _.size(self.routes);
  }

});

Template.reportTemplate.helpers({
  getHelpers : function() {
    var self = this;
    //console.log(self);
    return _.map(self.helpers, function(item, name) {
      return {name : name, value : item};
    })
  },
  getEvents : function() {
    var self = this;
    return self.events;
  },
  getCount : function() {
    var self = this;
    return _.size(self);
  }


});


Template.reportCollection.helpers({
  getSamples: function() {
    var self = this;
    var results = [];
    _.each(self.samples, function(item, index) { 
      results.push({ item : item });
    });
    
    //console.log(results);
    return results;
  }

});


Template.reportObject.helpers({
  getSamples: function() {
    var self = this;
    var results = [];
    _.each(self.samples, function(item, index) { 
      results.push({ item : item, index : index });
    });
    
    //console.log(results);
    return results;
  }

});




Template.reportResult.helpers({
  lastCheckDate: function() {
    var self = this;
    var date = self.lastScanDate;
    return moment(date).calendar();
  },

});

Template.reportResult.events({
  'click #refreshButton': function () {
    var self = this;
    //console.log("refresh >", self);
    Meteor.call('refreshReport', self._id, function(err, response) { 
      //console.log("result", err, response);
    });
  },
});