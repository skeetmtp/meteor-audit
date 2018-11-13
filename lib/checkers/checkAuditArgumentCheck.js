Checker.components.checkAuditArgumentCheck = function(data) {
    var self = data || this;
    var status = "success";
    var title = 'audit-argument-checks package installed'
    var comment = '';

    if(self.packages && self.packages.samples)
    {
      var autopublish = _.find(self.packages.samples, function(val) { return val && val.name && val.name === 'audit-argument-check'; });
      //console.log(autopublish);
      if(!autopublish) {
        status = "danger";
        title = 'audit-argument-checks package not installed';
        comment = 'meteor add audit-argument-checks';
      }
    }

    return { 
      id : 'audit-argument-check', 
      status: status, 
      label: Checker.helpers.statusToLabel(status),
      title : title, 
      comment : comment,
      link: '', 
    };
  };



