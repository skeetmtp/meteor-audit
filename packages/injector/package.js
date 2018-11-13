Package.describe({
    summary: "Inject script into a site through panthomjs"
});

Package.on_use(function(api){
    api.add_files('injector.js', 'server');
    api.export('Injector', 'server');
});