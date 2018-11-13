Checker.components.checkInsecure = function(data) {
  var self = data || this;
  var status = "success";
  var title = 'Insecure package removed';
  var comment = '';

  if(self.packages && self.packages.samples)
  {
    var insecure = _.find(self.packages.samples, function(val) { return val && val.name && val.name === 'insecure'; });
    if(insecure) {
      status = "danger";
      title = 'Insecure package not removed';
      comment = 'Need to remove insecure package';
    }
  }

  return { 
    id : 'checkInsecure', 
    status: status, 
    label: Checker.helpers.statusToLabel(status),
    title : title, 
    comment : comment,
    link: 'http://docs.meteor.com/#allow', 
  };
};



