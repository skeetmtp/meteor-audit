

Meteor.publish('reports', function (args) {
  console.log("publish reports", args);
  return Reports.find( {} );

  var arguments = args || {};
  var self = this;
  var userId = self.userId;
  var selector, options;

  var defaultSelector = { $and : [ { isDeleted : { $ne : true } } , { $or : [ { createdBy: userId }, { isDemo : true } ] } ] };
  var defaultOption = {
      fields : {
        loginToken : 0,
        logs : 0,
      },
      //sort: {createdAt: -1},
      limit : 10,
    };

  var user = Meteor.users.findOne(userId);
  if(user!==undefined && user.isAdmin) {
    selector = arguments.selector || defaultSelector;
    options = arguments.options || defaultOption;
  }
  else  {
    selector = defaultSelector;
    options = defaultOption;
  }

  if(arguments.entryId) {
    selector = arguments.entryId;
    //selector = { $and : [ { _id : arguments.entryId } , { isPublic : true } ] };
  }


  return Reports.find( selector, options );
});

Meteor.publish('screenshots', function () {
  console.log("publish screenshots");
  var self = this;
  var userId = self.userId;
  var selector = { $or : [ { createdBy: userId }, { isDemo : true } ] };
  var options = {
    limit : 10,
  };
  return Screenshots.find( selector, options );
});


Meteor.publish("userData", function () {
  var self = this;
  console.log("publish userData", self.userId);

  if (self.userId) {
    var user = Meteor.users.findOne(self.userId);
    if(user!==undefined && user.isAdmin) {
      var options = {
        fields: {'profile' : 1},
        sort: { isAdmin : -1},
        //limit : 10,
      };

      var cursor = Meteor.users.find( {}, options);
      var res = cursor.fetch();
      console.log(res.length);
      return cursor;
    }
    return Meteor.users.find({_id: self.userId});
  } 
  else {
    self.ready();
  }
});


