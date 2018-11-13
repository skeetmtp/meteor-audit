Settings = new Meteor.Collection("settings");

Migration = {};

Migration.version = 2;


Migration.migrate = function()
{
  var version = 0;
  var _id = null;
  if(Settings.find().count() === 0) {
    console.log("no db version, setting it to 0 ");
    _id = Settings.insert({version : 0});
    console.log(_id);
  }
  else
  {
    var entry = Settings.findOne();
    version = entry.version;
    _id = entry._id;
    console.log("db version = ", version);
  }

  if(Migration.version > version)
  {
    console.log("migrate from", version, " to ", Migration.version);

    if(version == 0)
    {
      Reports.remove({});
    } 

    if(version == 1)
    {
      var reports = Reports.find({}).fetch();
      _.each(reports, function(item) {
        var createdAt = new Date();
        if(item.createdAt !== undefined) {
          createdAt = new Date(item.createdAt);
        }
        console.log("createdAt >>",createdAt, item.createdAt);

        var lastScanDate = new Date();
        if(item.lastScanDate !== undefined) {
          lastScanDate = new Date(item.lastScanDate);
        }
        console.log("lastScanDate >>",lastScanDate, item.lastScanDate);

        Reports.update(item._id, { $set: { createdAt : createdAt.getTime(), lastScanDate : lastScanDate.getTime() } });

      })
    } 

    version = Migration.version;
    Settings.update(_id, { $set: {version: version} });
  }
  else
  {
    console.log("no migration needed");
  }

  //Settings.update(_id, { $set: {version: Migration.version} });
}