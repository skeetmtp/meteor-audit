Template.reportResult.helpers({
  collectionGeneric: function(data) {
    var self = data || this;
    var status = 'info';

    var title = self.name + '(' + self.size + ')';
    return { 
      id : 'collectionGeneric'+self.name, 
      status: status, 
      label: Checker.helpers.statusToLabel(status),
      title : title, 
      samples : self.samples,
      comment : '',
    };
  },
});



