Checker.components.checkXss = function(data) {
  var self = data || this;
  var status = "success";
  var title = 'content security policy';
  var comment = '';

  if(self.xss && self.xss.injected) {
    status = 'warning';
    title = 'content security policy (csp) not enabled';
    comment = 'for more information see http://meteorhacks.com/xss-and-meteor.html';
  }

  return { 
    id : 'checkXss', 
    status: status, 
    label: Checker.helpers.statusToLabel(status),
    title : title, 
    comment : comment,
    link: 'http://meteorhacks.com/xss-and-meteor.html', 
  };
};


