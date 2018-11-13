Checker.components.checkUsers = function(data) {
  var self = data || this;
  var status = "info";
  var comment = '';
  var title = '';
  var samples = [];

  if(self.users) {
    if(self.users.size > 30) {
      status = "warning";
      comment = "Lot of users are returned by Meteor.users() , is this intended ?";
    }
    title = 'Users(' + self.users.size + ')';
    samples = self.users.samples;
  }

  return { 
    id : 'checkUsers', 
    status: status, 
    label: Checker.helpers.statusToLabel(status),
    title : title, 
    samples : samples,
    comment : comment,
  };
};



