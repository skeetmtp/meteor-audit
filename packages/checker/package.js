Package.describe({
    summary: ""
});

Package.on_use(function(api){
    api.add_files('checker.js', ['client', 'server'] );
    api.export('Checker', ['client', 'server'] );
});