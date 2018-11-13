
Template.home.helpers({
  userLogged : function() {
    return Meteor.user() !== null;
  },
  showpage : function() {
    return true;//Session.get("showpage");
  },
  sliptReports : function() {
      var userId = Meteor.userId();
    var data = Reports.find({createdBy : userId}, {sort: {createdAt: -1}}).fetch();
    //var data = this.fetch();
    console.log(data);
    var chunks = [];
    var widthItemCount = 3;
    while(data.length > widthItemCount) {
      chunks.push({row : data.slice(0,widthItemCount)});
      data = data.slice(widthItemCount);
    }
    chunks.push({row : data}); //push remaining items
    //console.log(chunks);
    return chunks;
  },

});

var submitSite = function(url)
{
    Meteor.call('initReport', url, null, function(err, response) { 
      if(response) {
        //Router.go('/report/' + response);
        Meteor.call('refreshReport', response, function(err, response) { 
        });
      } 
      //console.log("result", err, response);
    });
    $('#submitInput').val('');
    $('#submitInput').focus();
}

Template.home.events({
  'click #submitButton': function () {
    submitSite($('#submitInput').val());
  },
  'keydown #submitInput': function (evt) {
    if (evt.which === 13) {
      submitSite($('#submitInput').val());
    }
  }

});



Template.reportItem.helpers({
  isDone : function() {
    var self = this;
    return self.status === "done";
  },
});


Template.validItem.helpers({
  errorCountToolTip : function() {
    var self = this;
    var errorCount = self.report.errorCount;
    if(errorCount == 0) {
      return "no error";
    }
    else if(errorCount == 1) {
      return "1 error";
    }
    else {
      return errorCount + " errors";
    }
  },
  lastCheckDate : function() {
    var self = this;
    var date = self.lastScanDate;
    return moment(date).calendar();
  },
});


Template.itemLastCheckDate.helpers({
  lastCheckDate : function() {
    var self = this;
    var date = self.lastScanDate;
    return moment(date).calendar();
  },
});


Template.itemButtons.helpers({
  buttons : function() {
    var self = this;
    var results = [];
    if(self.status === "done") {
     results.push({id: "refreshButton", text: "Refresh", parent: self});
    }
    results.push({id: "deleteButton", text: "Delete", parent: self});
    return results;
  },
});

var updateLoginToken = function(id, loginToken)
{
    //console.log("updateLoginToken >", id, loginToken);
    Meteor.call('refreshReport', id, loginToken, function(err, response) { 
      //console.log("result", err, response);
    });
}


Template.itemButtons.events({
  'click #refreshButton': function () {
    var self = this;
    //console.log("refreshButton >", self);
    Meteor.call('refreshReport', self.parent._id, function(err, response) { 
      //console.log("refresh result", err, response);
    });
  },
  'click #deleteButton': function () {
    var self = this;
    //console.log("deleteButton >", self.parent);
    //Reports.remove(self.parent._id);
    Meteor.call('deleteReport', self.parent._id, true, function(err, response) { 
      //console.log("result", err, response);
    });
  },
  'click #loginTokenButton': function (event, template) {
    var self = this;
    //console.log(self);
    var tokenInput = template.find("#loginTokenInput").value;
    updateLoginToken(self._id, tokenInput);
  },
  'keydown #loginTokenInput': function (event, template) {
    if (event.which === 13) {
      var tokenInput = template.find("#loginTokenInput").value;
      updateLoginToken(self._id, tokenInput);
    }
  }

});

