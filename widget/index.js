 var explorer = window.Kloudless.explorer({
     // JotForm Kloudless App ID
     app_id: "Hs_l0xUXMPC4nsmJ0oABuSvK3gTZWNLnV7F4InGfYqixT28G",
     multiselect: JFCustomWidget.getQueryString('multiselect') === 'true',
     link: true,
     direct_link: true,
     types: ['files'],
     computer: false,
 });
explorer.choose();

JFCustomWidget.subscribe("ready", function(){
    explorer.choose();
    explorer.on('success', function(files) {
        var links = files.map(function(f) { return f.link; });
        JFCustomWidget.subscribe("submit", function(){
            var msg = {
                valid: true,
                value: links.join(" "),
            };
            JFCustomWidget.sendSubmit(msg);
        });
    });
});