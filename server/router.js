
var buildReport = function(data) {
  //console.log(data);
  var  result = {};
  result.components = {};
  _.each(Checker.components, function(component, label) {
    result.components[label] = component(data);
  });
  //console.log(results);
  errorCount = 0;
  _.each(result.components, function(item) {
    if(item.status === "danger") {
      errorCount++;
    }
  });
  result.errorCount = errorCount;
  return result;
}

//TODO accept only from localhost ...
Router.map(function() {
  this.route('rest_api_report', {
      path: '/api/call/report',
      where: 'server',
      action: function() {
          // GET, POST, PUT, DELETE
          var requestMethod = this.request.method;
          // Data from a POST request
          var requestData = this.request.body;
          // Could be, e.g. application/xml, etc.
          this.response.writeHead(200, {'Content-Type': 'text/html'});
          var requestDataStr = JSON.stringify(requestData, null, 2)
          //console.log('received post data', requestDataStr);
          console.log('/api/call/report : received post data');
          this.response.end('<html><body>Your request was a ' + requestMethod + 'conetnt' + requestDataStr + '</body></html>');
          var rawData = requestData.result;
          var entryId = requestData.entryId;
          var report = buildReport(rawData);
          Reports.update(entryId, {$set: {rawData: rawData, report: report, status: "done", receivedData: true}});
      }
  });

  this.route('rest_api_screenshot', {
      path: '/api/call/screenshot',
      where: 'server',
      action: function() {
          // GET, POST, PUT, DELETE
          var requestMethod = this.request.method;
          // Data from a POST request
          var requestData = this.request.body;
          // Could be, e.g. application/xml, etc.
          this.response.writeHead(200, {'Content-Type': 'text/html'});
          var requestDataStr = JSON.stringify(requestData, null, 2)
          //console.log('received post data', requestDataStr);
          console.log('/api/call/screenshot : received post data');
          this.response.end('<html><body>Your request was a ' + requestMethod + 'content' + requestDataStr + '</body></html>');
          var base64 = requestData.base64;
          var entryId = requestData.id;
          var userId = requestData.userId;

          if(entryId) {
            var entry = Screenshots.findOne(entryId);
            if(entry === undefined) {
                Screenshots.insert({_id: entryId, createdBy: userId, base64: base64});
            }
            else {
                Screenshots.update(entryId, {$set: {createdBy: userId, base64: base64} });
            }
          }
          else {
            console.warn('invalid entryId : ', entryId);
          }
      }
  });

  this.route('rest_api_none', {
      path: '/api/none',
      where: 'server',
      action: function() {
          // GET, POST, PUT, DELETE
          var requestMethod = this.request.method;
          // Data from a POST request
          var requestData = this.request.body;
          // Could be, e.g. application/xml, etc.
          this.response.writeHead(200, {'Content-Type': 'text/html'});
          var requestDataStr = JSON.stringify(requestData, null, 2)
          //console.log('received post data', requestDataStr);
          console.log('/api/none reach');
          this.response.end('<html><body></body></html>');
      }
  });
});


