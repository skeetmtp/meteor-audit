var now = function()
{
  var date = new Date();
  return date.getTime();
}

var onScanFinish = function(args, error, stdout, stderr) {
  var logs = { error : JSON.stringify(error, null, 2), stdout : stdout, stderr : stderr };
  //console.log("onFinish", JSON.stringify(args, null, 2));
  //console.log("onFinish", JSON.stringify(logs, null, 2));
  //console.log("onFinish", logs.stdout);
  Reports.update(args.entryId, { $set: {logs: logs, status: "done", lastScanDate: now()}} );
};


Meteor.startup(function () {
  // code to run on server at startup
  var scriptContent = Assets.getText('script.js');

  var adminUsers = [];
  var adminUserIds = ["RNPRA7DGFaoYLnL5F", "ALvjjrDa6fA62KfYM", "Gtk8dZz2rZQLE9S6k", "NChSBfpQcvkKN3Fia"];
  
  _.each(adminUserIds, function(id) {
    var adminUser = Meteor.users.findOne(id);
    if(adminUser) { 
      adminUsers.push(adminUser); 
    }
  });

  _.each(adminUsers, function(adminUser) {
    console.log(adminUser);
    Meteor.users.update(adminUser._id, {$set: { isAdmin : true} } );
  })

  //Meteor.users.update("RNPRA7DGFaoYLnL5F", {$set: { profile : { name : 'skeetmtp' } } } ); //Hack test profile name...
  if(false) {
    console.log("Clearing db...");
    Reports.remove({});
    Screenshots.remove({});
  }

  Migration.migrate(); 

  Meteor.methods({
    
    initReport : function (url, loginToken) {
      console.log("initReport", url);
      var prefix = 'http';
      if (url.substr(0, prefix.length) !== prefix)
      {
          url = 'http://' + url;
      }

      var userId = Meteor.userId();
      var withLoginToken = loginToken !== undefined;
      if(userId) {
        
        var entry = Reports.findOne({ createdBy: userId, url: url});
        if(!entry) {
          entry = {
            createdBy : userId,
            url : url,
            loginToken : loginToken,
            withLoginToken : withLoginToken,
            createdAt: now(),
            isDeleted: false,
          };
          entry._id = Reports.insert(entry);
        }
        else {
          Reports.update(entry._id, { $set: {loginToken : loginToken, withLoginToken : withLoginToken, isDeleted : false} });
        }
        console.log("initReport", entry);
        return entry._id;
      }
      return null;
    },

    deleteReport : function (entryId, isDeleted) {
      console.log("deleteReport", entryId);
      var userId = Meteor.userId();

      var report = Reports.findOne(entryId);
      if(report.createdBy !== userId) {
        //throw new Error("cannot do action on report of another userId");
        return "cannot do action on report of another userId";
      }
      Reports.update(entryId, { $set: { isDeleted: isDeleted } });
    },

    setDemo : function (entryId, isDemo) {
      console.log("setPublic", entryId);
      var userId = Meteor.userId();

      var report = Reports.findOne(entryId);
      if(report.createdBy !== userId) {
        //throw new Error("cannot do action on report of another userId");
        return "cannot do action on report of another userId";
      }
      Reports.update(entryId, { $set: { isDemo: isDemo } });

      var screenshot = Screenshots.findOne(entryId);
      if(screenshot.createdBy !== userId) {
        //throw new Error("cannot do action on report of another userId");
        return "cannot do action on report of another userId";
      }
      Screenshots.update(entryId, { $set: { isDemo: isDemo } });
    },

    setPublic : function (entryId, isPublic) {
      console.log("setPublic", entryId);
      var userId = Meteor.userId();

      var report = Reports.findOne(entryId);
      if(report.createdBy !== userId) {
        //throw new Error("cannot do action on report of another userId");
        return "cannot do action on report of another userId";
      }
      Reports.update(entryId, { $set: { isPublic: isPublic } });

      var screenshot = Screenshots.findOne(entryId);
      if(screenshot.createdBy !== userId) {
        //throw new Error("cannot do action on report of another userId");
        return "cannot do action on report of another userId";
      }
      Screenshots.update(entryId, { $set: { isPublic: isPublic } });
    },

    refreshReport : function (entryId, loginToken) {
      console.log("refreshReport ", entryId, loginToken);
      var userId = Meteor.userId();
      var user = Meteor.users.findOne(userId);
      var entry = Reports.findOne(entryId);
      if(entry.createdBy !== userId && !user.isAdmin) {
        //throw new Error("cannot do action on report of another userId");
        return "cannot do action on report of another userId";
      }
      if(entry) {
        
        if(loginToken !== undefined) {
          entry.loginToken = loginToken;
        }

        entry.withLoginToken = entry.loginToken !== null;

        var args = {
          url : entry.url,
          loginToken : entry.loginToken,
          entryId : entry._id,
          userId: entry.createdBy,
        };

        Reports.update(entry._id, { $set: { status: "pending", receivedData: false, loginToken: entry.loginToken, withLoginToken: entry.withLoginToken } });

        Injector.Run(scriptContent, args, onScanFinish);
        return "ok";
      }

      return "id not found";
    },


  });

/*
  //directly serve screenshot files from /.screenshots dir
  var fs = Npm.require('fs');
  WebApp.connectHandlers.use(function(req, res, next) {
      var re = /^\/screenshots\/(.*)$/.exec(req.url);
      if (re !== null) {   // Only handle URLs that start with /screenshots/*
          var filePath = process.env.PWD + '/.screenshots/' + re[1];
          var data = fs.readFileSync(filePath, data);
          res.writeHead(200, {
                  'Content-Type': 'image'
              });
          res.write(data);
          res.end();
      } else {  // Other urls will have default behaviors
          next();
      }
  });
  */

  var args = {
          url : "http://127.0.0.1:3000/",
          loginToken : null,
          entryId : '8o6ZxfuakxH2w7NFW',
          userId: 'wTvjCrvfmx42peH42',
        };

  //Injector.Run(scriptContent, "http://audit.meteor.com/");
  //Injector.Run(scriptContent, args);
  
});
