var neededVersion = "0.8.2";

Checker.components.checkVersion = function(data) {
  console.log(data);
  var self = data || this;
  var title = '';
  var status = "success";
  var comment = '';
  if(self.meteor && self.meteor.version) {
    title = 'Meteor Version : ' + self.meteor.version;
    if(Checker.helpers.versionCompare(self.meteor.version, neededVersion) < 0) {
      status = 'warning';
      comment = 'Need to update meteor to version ' + neededVersion + ' or better...';
    }
  }

  return { 
    id : 'checkVersion', 
    status: status, 
    label: Checker.helpers.statusToLabel(status),
    title : title, 
    comment : comment,
    link: 'https://github.com/meteor/meteor/blob/master/History.md', 
  };
};



