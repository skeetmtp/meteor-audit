Checker.components.checkAutopublish = function(data) {
    var self = data || this;
    var status = "success";
    var title = 'Autopublish package removed'
    var comment = '';

    if(self.packages && self.packages.samples)
    {
      var autopublish = _.find(self.packages.samples, function(val) { return val && val.name && val.name === 'autopublish'; });
      //console.log(autopublish);
      if(autopublish) {
        status = "danger";
        title = 'Autopublish package not removed';
        comment = 'Need to remove autopublish package';
      }
    }

    return { 
      id : 'autopublish', 
      status: status, 
      label: Checker.helpers.statusToLabel(status),
      title : title, 
      comment : comment,
      link: 'http://docs.meteor.com/#meteor_collection', 
    };
  };



