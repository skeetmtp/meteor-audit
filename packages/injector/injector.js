var fs = Npm.require('fs');
var child_process = Npm.require('child_process');

Injector = {};
Injector.version = "0.1.0";


// how long to let phantomjs run before we kill it
var REQUEST_TIMEOUT = 40*1000;
// maximum size of result HTML. node's default is 200k which is too
// small for our docs.
var MAX_BUFFER = 5*1024*1024; // 5MB


// var args = {
//   url : url,
//   loginToken : loginToken,
// };
Injector.Run = function(scriptContent, args, onFinish) {
  console.log("Injector.Run", args);
  //var scriptContent = Assets.getText('script.js');
  //console.log("scriptContent", scriptContent);

  //console.log(JSON.stringify(process.env.ROOT_URL));
  //var localhost = process.env.ROOT_URL;
  //var localhost = Meteor.absoluteUrl("", { secure : true });
  var localhost = Meteor.absoluteUrl("");
  //localhost = localhost.replace(/^http:\/\//i, 'https://');

  var launchParams = {
    localhost : localhost,
    rootDir : process.env.PWD,
  };  
  launchParams = _.extend(launchParams, args);
  
  console.log("injecting", launchParams);
  var launchParamsLine = "var launchParams = " + JSON.stringify(launchParams, null, 2) + ";\n";

  var onFinishCallBack = null;
  if(onFinish) {
    var onException = function(err) {
      console.log("onException", err);
    }
    onFinishCallBack = Meteor.bindEnvironment(onFinish, onException, this);
  }
  //--ignore-ssl-errors=true
  child_process.execFile(
    '/bin/bash',
    ['-c', ("exec phantomjs --load-images=yes /dev/stdin <<'END'\n" + launchParamsLine + scriptContent + "END\n")],
    {timeout: REQUEST_TIMEOUT, maxBuffer: MAX_BUFFER},
    function (error, stdout, stderr) {
      console.log("exec result output :");
      console.log("=========== START =============");
      console.log("error : ");
      console.log(error);
      console.log("stdout : ");
      console.log(stdout);
      console.log("stderr : ");
      console.log(stderr);
      console.log("===========  END  =============");
      if(onFinishCallBack) {
        onFinishCallBack(args, error, stdout, stderr);
      }
    }
  );


}

