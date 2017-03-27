var links = [];
var clicked = false;

var kloudlessAppId = "Hs_l0xUXMPC4nsmJ0oABuSvK3gTZWNLnV7F4InGfYqixT28G";
var kloudlessAccountId = 45245627;

var explorer = window.Kloudless.explorer({
    // Defaults to the JotForm Kloudless App ID
    app_id: JFCustomWidget.getQueryString('app_id') || kloudlessAppId,
    multiselect: JFCustomWidget.getQueryString('multiselect') !== 'false',
    link: true,
    direct_link: true,
    types: ['files'],
    computer: true,
});

function resize() {
    JFCustomWidget.requestFrameResize({
        width: 700,
        height: 515
    });
}

explorer.on('success', function(files) {
    $("#files").empty();
    $(".files-desc").hide();

    links = files.map(function(f) {
        var validity = "";
        if (f.account === kloudlessAccountId) {
            validity = " (valid for 30 days)";
        }

        $("#files").append('<li><a target="_blank" href="' + f.link + '">' +
                           f.name + '</a>' + validity + '</li>');
        return f.link;
    });
    if (links && links.length >= 1) {
        $(".files-desc").show();
    }
    JFCustomWidget.sendData({value: links.join(" ")});
});

$("#upload").click(function() {
    clicked = true;
    resize();
    explorer.choose();
});

JFCustomWidget.subscribe("ready", function(){
    if (clicked) resize();
    JFCustomWidget.subscribe("submit", function(){
        var msg = {
            valid: true,
            value: links.join(" "),
        };
        JFCustomWidget.sendSubmit(msg);
    });
});
