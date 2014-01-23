var url = 
    "https://spreadsheets.google.com/feeds/list" + 
    "/0AgBEpBEeCWyVcnIyd2RWV3dxRThQYXZCdWhNWXBEZmc" +
    "/od6/public/values?alt=json-in-script&callback=?";

var titleUrl = 'https://docs.google.com/spreadsheet/pub?key=0AgBEpBEeCWyVcnIyd2RWV3dxRThQYXZCdWhNWXBEZmc&single=true&gid=0&output=html'

var field_names = [
    'calculated',
    'date',
    'display',
    'g',
    'gallons',
    'odo',
    'station',
    'total',
    'trip',
]; 

function timeSeries(config) {
    $(config.elementId).highcharts({
        chart: {
            type: 'spline',
            zoomType: 'x'
        },
        title: {
            text: config.title,
            x: -20 //center
        },
        subtitle: {
            text: config.subtitle,
            x: -20
        },
        xAxis: {
            type: 'datetime',
        },
        yAxis: {
            title: { text: config.yAxis },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        series: config.series
    });
}

calc = [];
display = [];
$.getJSON(url,{}, function (data) { 
    for (var i=3; i<data.feed.entry.length; i++) {
        var entry = data.feed.entry[i];
        var dateString = entry.gsx$date.$t;
        var calcString = entry.gsx$calculated.$t;
        var displayString = entry.gsx$display.$t;
        if (dateString.length > 0 && calcString.length > 0) {
            var t = Date.parse(dateString);
            var c = parseFloat(calcString);
            var d = parseFloat(displayString);
            calc.push([t, c]);
            display.push([t, d]);
        } 
    }

    timeSeries({
        elementId: '#calc',
        title: 'Mileage',
        subtitle: '<a href="' + titleUrl + '">Source: google doc</a>',
        yAxis: 'Mileage (mpg)',
        series: [{
            data: calc,
            name: 'Calculated'
        }, {
            data: display,
            name: 'Display'
        }]
    });

});
