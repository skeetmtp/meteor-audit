Checker.components.checkStartup = function(data) {
  var self = data || this;
  var title = "";
  var status = "info";
  var comment = '';

  if(self.startup) {
    if(self.startup.durationMs > 5000) {
      status = "warning";
      comment = "Page startup takes quite some time...";
    }
    else {
      title = 'Startup duration ' + self.startup.durationMs + 'Ms';      
    }
  }

  return { 
    id : 'checkStartup', 
    status: status, 
    label: Checker.helpers.statusToLabel(status),
    title : title, 
    comment : comment,
  };
};



