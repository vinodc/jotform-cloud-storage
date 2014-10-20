var links = [];

var explorer = window.Kloudless.explorer({
    // JotForm Kloudless App ID
    app_id: "Hs_l0xUXMPC4nsmJ0oABuSvK3gTZWNLnV7F4InGfYqixT28G",
    multiselect: true /*JFCustomWidget.getQueryString('multiselect') === 'true'*/,
    link: true,
    direct_link: true,
    types: ['files'],
    computer: false,
});

explorer.on('success', function(files) {
    $("#files").empty();
    $(".files-desc").hide();
    var links = files.map(function(f) {
        $("#files").append('<li><a target="_blank" href="' + f.link + '">' +
                           f.name + '</a></li>');
        return f.link;
    });
    if (links && links.length > 1) {
        $(".files-desc").show();
    }
});

explorer.choosify(document.getElementById('upload'));

JFCustomWidget.subscribe("ready", function(){
    JFCustomWidget.subscribe("submit", function(){
        var msg = {
            valid: true,
            value: links.join(" "),
        };
        JFCustomWidget.sendSubmit(msg);
    });
});