//constants
var viewportSize = { width: 1200, height: 850 };

//args ...
var args = require('system').args;
var webpage = require("webpage");
var localhost = 'localhost';
var url = 'http://localhost:3000/';
var loginToken = '';
var rootDir = './';
var entryId = 'fooBar';
var userId = null;

if(typeof launchParams !== 'undefined') {
  //console.log("launchParams:  " + JSON.stringify(launchParams, null, 2));
  localhost = launchParams.localhost;
  url = launchParams.url;
  loginToken = launchParams.loginToken;
  rootDir = launchParams.rootDir;
  entryId = launchParams.entryId;
  userId = launchParams.userId;
}

function waitFor(testFx, onReady, onTimeout, timeOutMillis) {
  console.log('starting waitFor ...');
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 20000, //< Default Max Timout in s
      start = new Date().getTime(),
      condition = false,
      interval = setInterval(function() {
          if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
              // If not time-out yet and condition not yet fulfilled
              condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
          } else {
              if(!condition) {
                  // If condition still not fulfilled (timeout but condition is 'false')
                  clearInterval(interval); //< Stop this interval
                  console.log("'waitFor()' timeout");
                  onTimeout(timeOutMillis);
              } else {
                  // Condition fulfilled (timeout and/or condition is 'true')
                  var durationMs = new Date().getTime() - start;
                  console.log("'waitFor()' finished in " + durationMs + "ms.");
                  clearInterval(interval); //< Stop this interval
                  //onReady(); //< Do what it's supposed to do once the condition is fulfilled
                  setTimeout(function() { 
                    onReady(durationMs); 
                  } , 0);
              }
          }
      }, 250); //< repeat check every 250ms
}; 

var isConnected = function(page, loginTokenArg)
{
    return page.evaluate(function(loginTokenArg) {
      console.log("---- ready check ----" /*, loginTokenArg */, typeof Meteor);

      if(typeof Meteor !== 'undefined') {
        console.log("> Meteor.status");
        if(typeof Meteor.status !== 'undefined') {
          console.log(">> Meteor.status().connected ", Meteor.status().connected);
        }

      }

      //http://www.meteorpedia.com/read/spiderable
      if (typeof Meteor !== 'undefined' && typeof Meteor.status !== 'undefined' && Meteor.status().connected) {
        console.log("Meteor.status().connected == true !!!" /*, loginTokenArg*/);
        if( typeof loginTokenArg == 'undefined' || loginTokenArg == null || loginTokenArg == 'null' || loginTokenArg === undefined || loginTokenArg === '' ) {
          console.log("no loginTokenArg");
          Deps.flush();
          var ready = DDP._allSubscriptionsReady();
          console.log("_allSubscriptionsReady 1", DDP._allSubscriptionsReady());
          if(ready) {
            console.log("ready finish 1");
          }
          return ready;
        }
        else {

          console.log("with longinToken ready check 2");

          if(typeof __ScriptIsLoggingIn__ === 'undefined') {
            __ScriptIsLoggingIn__ = true;
            Meteor.loginWithToken(loginTokenArg, function(err) { console.log("login result : ", err); }); 
            console.log("ready login");
          }

          var logged =  Meteor.loggingIn() === false && Meteor.user() !== null ;
          if(logged) {
            Deps.flush();
            console.log("_allSubscriptionsReady 2", DDP._allSubscriptionsReady());
            var ready = DDP._allSubscriptionsReady();
            if(ready) {
              console.log("ready finish 2");
            }
            return ready;

          }
          return logged;

        }
      }
      else {
        console.log("still waiting for Meteor.status().connected()");
      }
      return false;
    }, loginTokenArg);
}



var onReady = function(entryId, userId, page, url, localhost, screenshotFileName, durationMs) {
  console.log("onReady", localhost, durationMs);

  //page.render(screenshotFileName, {format: 'jpeg', quality: '40'});
  var base64Screenshot = false;
  base64Screenshot = page.renderBase64('JPEG');

  var result = page.evaluate(function(url, localhost, durationMs) {
    console.log("localhost = ", localhost);

    var logCollection = function(col, collectionName)  {
      console.log("logCollection", col, collectionName);
      if(col === null || col === undefined) {
        return { name : collectionName, size : 0, samples : []};
      }

      var queryAll = col.find({});
      var queryLimited = col.find({}, {limit : 10});
      var count = queryAll.count();
      
      console.log(collectionName, col._name + " size = " + count);
      
      var samples = [];
      _.each(queryLimited.fetch(), function(item) {
        var sampleStr = JSON.stringify(item, null, 2);
        if(sampleStr.length > 140) {
          sampleStr = sampleStr.substring(0,140) + " ...";
        }
        samples.push(sampleStr);
      });
      return { name : collectionName, size : count, samples : samples };
    }

    var textXss = url.search("https") === -1; //xss check currently do not work on https site...

    var allCollections = {};

    var user = null;

    var userCount = 0;
    var usersLog = logCollection(null, "users");
    if (typeof Meteor.users !== 'undefined') {
      user = Meteor.user();
      userCount = Meteor.users.find({}).count();
      allCollections["users"] = Meteor.users;
      usersLog = logCollection(Meteor.users, "users"),
      console.log("userCount:  " + userCount);
    }



    console.log("globalCollections");
    var globalCollections = [];
    for (var collectionName in window) {
      if (window[collectionName] instanceof Meteor.Collection) {
        var col = window[collectionName];
        allCollections[col._name] = col;
        globalCollections.push(logCollection(col, collectionName));
      }
    }

    console.log("privateCollections");
    var privateCollections = [];
    for (var collectionName in Meteor.connection._mongo_livedata_collections) {
      if(!allCollections.hasOwnProperty(collectionName) ) {
        if(collectionName.indexOf("meteor") != 0) {
          var collectionWrapperName = "sheltered_" + collectionName;
          var src = Meteor.connection._mongo_livedata_collections[collectionName];
          var collectionWrapper = new Meteor.Collection(collectionWrapperName);
          collectionWrapper._name = collectionName;
          collectionWrapper._prefix = "/" + collectionName  + "/";
          collectionWrapper._collection = src;
          delete Meteor.connection._stores[collectionWrapperName]; //remove duplicated stores "Error : Called saveOriginals twice without retrieveOriginals"
          allCollections[collectionName] = collectionWrapper;
          privateCollections.push(logCollection(collectionWrapper, collectionName));
        }
      }
    }


    var oauth = [];
    if(typeof Accounts !== 'undefined' && Accounts.oauth) {
      var oauthServices = Accounts.oauth.serviceNames();
      _.each(oauthServices, function(serviceName) {
        oauth.push({name : serviceName});
      });
    }

    var packages = {};
    _.each(Package, function(package, name) {
      packages[name] = name;
    });

    var ironRouter = null;
    if('iron-router' in packages) {
      ironRouter = {};
      ironRouter.routes = _.map(Router.routes, function(route) { 
        var options = {};
        if(route.options.data !== undefined) {
          options.data =  "" + route.options.data;
        }
        if(route.options.waitOn !== undefined) {
          options.waitOn =  "" + route.options.waitOn;
        }
        options.path = route.options.path;

        return { 
          name: route.name , 
          options : options,
          originalPath : route.originalPath,
          where : route.where,
        };
      });
    }

    var session = {};
    if(Session.keys!==undefined) {
      var keys = Session.keys;
      session = { name : "session", size : _.size(keys), samples : keys };
    }

    var templates = null;
    /*
    if (typeof Template !== 'undefined') {
      templates = [];
      for(idx in Template) {
        var template = Template[idx];
        var templateName = idx;
        console.log("template : ", template, templateName);
        if(template !== undefined) {
          if (templateName !== '__define__') {
            
            var helpers = {};
            _.each(template, function(field, fieldName) {
              if(fieldName !== '_constr' && fieldName !== 'render') {
                if(_.isFunction(field)) {
                  helpers[fieldName] = "" + field;
                }
              }
            });

            var events = [];
            if(typeof template._events !== 'undefined') {
              _.each(template._events, function(event, index) {
                  events.push({ name : event.events, handler : "" + event.handler, selector : event.selector });
                });
            }
            
            templates.push({ name : templateName, helpers : helpers, events : events});
          }
        }
        
      };
    }
    */

    var result = {
      user : user,
      users : usersLog,
      meteor : { version : Meteor.release },
      collections : { globals : globalCollections, privates : privateCollections },
      packages : { name : "packages", size : _.size(packages), samples : packages},
      oauth : { name : "oauth", size : _.size(oauth), samples : oauth},
      templates : templates,
      title : document.title,
      xss : { checked : textXss, injected : typeof __xss_var__ !== 'undefined'},
      startup : { durationMs : durationMs },
      date : new Date(),
      ironRouter : ironRouter,
      session : session,
    };

    return result;
  }, url, localhost, durationMs);

  //console.log("result : " +   JSON.stringify(result));

  var sendData = { localhost: localhost, scanResult : { entryId: entryId, userId: userId, result : result}, screenshot : { id: entryId, userId: userId, base64 : base64Screenshot} };
  var page2 = webpage.create();
  page2.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE 2: ' + msg);
  };


  //we must re open a new page on localhost to be authorizeed by browser to post to localhost
  page2.open(localhost+"api/none", function(status) {
    //console.log("post data status : " +   JSON.stringify(status));
    //console.log("page2 status", status);

    page2.evaluate(function(data) {

      var postData = function(localhost, url, data) {
        // construct an HTTP request
        var xhr = new XMLHttpRequest();
        var destUrl = (localhost+url).replace(/([^:]\/)\/+/g, "$1");
        console.log("page2 destUrl", destUrl);
        xhr.open("post", destUrl, false);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        // send the collected data as JSON
        xhr.send(JSON.stringify(data));

        xhr.onloadend = function () {
          // done
        };
      };

      postData(data.localhost, "/api/call/report", data.scanResult);
      if(data.screenshot.base64) {
        postData(data.localhost, "/api/call/screenshot", data.screenshot);
      }
    }, sendData);


    console.log("exit2");
    phantom.exit();

  });

};






var page = webpage.create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = true;
page.viewportSize = viewportSize;
page.clipRect = { top: 0, left: 0, width: viewportSize.width, height: viewportSize.height };

//--ssl-protocol=sslv1
//--web-security=false
//--ignore-ssl-errors=true
/*
page.customHeaders = {
  "Accept-Encoding": "identity"
};
*/

page.onResourceError = function(resourceError) {
    console.log("onResourceError", JSON.stringify(resourceError));
    page.reason = resourceError.errorString;
    page.reason_url = resourceError.url;
};

page.onResourceTimeout  = function(request) {
    console.log("onResourceTimeout", JSON.stringify(request));
};

page.onResourceRequested = function (request) {
    console.log('= onResourceRequested()');
    //console.log('  request: ' + JSON.stringify(request, undefined, 4));
};
 
page.onResourceReceived = function(response) {
    console.log('= onResourceReceived()' );
    //console.log('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
};

page.onConfirm = function(msg) {
  console.log('onConfirm: ', msg);
};

page.onAlert  = function(msg) {
  console.log('onAlert : ', msg);
};

page.onClosing = function(closingPage) {
  console.log('onClosing: ', closingPage);
};

page.onLoadStarted = function() {
  console.log('onLoadStarted: ');
};

page.onError = function(data, trace) {
  //console.log('onError: ' + JSON.stringify(data));
  var msgStack = ['PHANTOM ERROR: ' + data];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.log('onError : ' + msgStack.join('\n'));
  //phantom.exit();
};

page.onPageCreated   = function(newPage) {
  console.log('onPageCreated: ' , newPage);
};

page.onUrlChanged  = function(targetUrl) {
  console.log('onUrlChanged: ' , targetUrl);
};

page.onNavigationRequested = function(url, type, willNavigate, main) {
  console.log('onNavigationRequested: ' , url, type, willNavigate, main);
};

page.onCallback = function(data) {
  console.log('onCallback: ' + JSON.stringify(data));
};

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg);
};

page.onLoadFinished = function(status) {
  console.log("onLoadFinished Status:  " + status);
  //console.log("loginToken:  " + loginToken);

  if(status === 'fail') {
    console.log(
                "Error opening url \"" + page.reason_url
                + "\": " + page.reason
            );
    phantom.exit();
    return;
  }

  var result = page.evaluate(function(url, localhost) {
    var loadXss = function() {
      var xssSrc = (localhost + "/xss.js").replace(/([^:]\/)\/+/g, "$1");
      console.log("xsssrc = ", xssSrc);
      var js = document.createElement('script');
      js.src = xssSrc;
      js.async = false;
      js.defer = false;
      var first = document.getElementsByTagName('script')[0];
      if(first) {
       first.parentNode.insertBefore(js, first);
      }
      else {
        console.log("script node not found... cannot test xss");
      }
    }

    var textXss = url.search("https") === -1; //xss check currently do not work on https site...
    if(textXss) { 
      loadXss();
    }
  }, url, localhost);

  var screenshotFileName = rootDir + '/.screenshots/' + entryId + '/main.jpeg';
  waitFor(
    function() { return isConnected(page, loginToken); }, 
    function(durationMs) { onReady(entryId, userId, page, url, localhost, screenshotFileName, durationMs); },
    function(durationMs) {  onReady(entryId, userId, page, url, localhost, screenshotFileName, durationMs); }
    );



};

console.log("loading ... ", url);
page.open(url);


