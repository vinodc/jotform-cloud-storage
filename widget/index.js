var returnData = [];
var initialized = false;

var kloudlessAppId = "Hs_l0xUXMPC4nsmJ0oABuSvK3gTZWNLnV7F4InGfYqixT28G";
var kloudlessAccountId = 45245627;

var initialWidth = 0;
var initialHeight = 0;

function resize(x, y) {
  if (x === undefined) x = initialWidth;
  if (y === undefined) y = Math.max(
    $("body").outerHeight() + 25, initialHeight);
  JFCustomWidget.requestFrameResize({width: x, height: y});
}

function stringToList(data) {
  if (!data) return [];
  return data.split(',').map(function(i) {
    return i.trim();
  });
}

function init() {
  if (initialized) return false;

  var wOptions = JFCustomWidget.getWidgetSettings();
  var getLink = wOptions['getLink'] !== 'false';
  var services = stringToList(wOptions["services"] || "all");
  var types = stringToList(wOptions["allowTypes"] || "files");
  var allowComputer = wOptions['allowComputerUpload'] !== 'false';

  var explorer = window.Kloudless.explorer({
    // Defaults to the JotForm Kloudless App ID
    app_id: wOptions['appId'] || kloudlessAppId,
    multiselect: wOptions['multiselect'] !== 'false',
    link: getLink,
    direct_link: getLink,
    services: services,
    types: types,
    account_management: !(services.length === 0 && allowComputer),
    computer: allowComputer,
  });

  explorer.on('success', function(files) {
    $("#files").empty();
    $(".files-desc").hide();

    returnData = files.map(function(f) {
      if (getLink) {
        var validity = "";
        if (f.account === kloudlessAccountId) {
          validity = " (valid for 30 days)";
        }

        $("#files").append('<li><a target="_blank" href="' + f.link + '">' +
                           f.name + '</a>' + validity + '</li>');
        return f.link;
      }
      else {
        $("#files").append('<li>' + (f.path || f.name) + '</li>');
        return f.path || f.name;
      }
    });

    if (returnData && returnData.length >= 1) {
      $(".files-desc").show();
    }
    resize();

    JFCustomWidget.sendData({value: JSON.stringify(returnData)});
  });

  $("#upload").click(function() {
    resize(700, 515);
    explorer.choose();
  });

  var widgetData = JFCustomWidget.getWidgetData();
  initialHeight = widgetData.height;
  initialWidth = widgetData.width;

  initialized = true;
}

JFCustomWidget.subscribe("ready", function(){
  init();

  JFCustomWidget.subscribe("submit", function(){
    var msg = {
      valid: true,
      value: JSON.stringify(returnData),
    };
    JFCustomWidget.sendSubmit(msg);
  });
});
