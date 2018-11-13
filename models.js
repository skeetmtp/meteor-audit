Reports = new Meteor.Collection("reports");
Screenshots = new Meteor.Collection("screenshots");

  Reports.allow({
    remove : function (userId, report) {
      return report.createdBy === userId;
    }
  });
