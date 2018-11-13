
UI.registerHelper('stringify', function(context, options) {
  var value = context;
  if(value) {
    return JSON.stringify(value, null, 2);
  }
  return "";
});

UI.registerHelper('split', function(context, options) {
  var results = [];
  var value = context;
  if(value) {
    console.log(value);
    _.each(value.split('\n'), function(item, index) {
      results.push({ item : item });
    });
  }
  return results;
});



UI.registerHelper('showPleaseWait', function(context, options) {
    var res =  Meteor.loggingIn() || Session.get('data_loaded') === false;
    return res;
});


UI.registerHelper('formatCommentLink', function(context, options) {
  var value = context || this;
  if(value) {
    if(value.link) {
      return '<a class="nounderline"  href='+ value.link +'> ' + value.comment +' </a>';
    }
    else {
      return value.comment;
    }
  }
});




UI.registerHelper('getScreenshotBase64', function(context, options) {
  //console.log("::", context, this);
  var value = context;
  if(value === undefined && this !== undefined) {
    value = this._id;
  }
  if(value) {
    var screenshot = Screenshots.findOne(value);
    if(screenshot !== undefined) {
      return screenshot.base64;
    }
    return "";
  }
  return "";
});
