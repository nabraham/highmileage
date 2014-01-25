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


$.getJSON(url,{}, function (data) { 
    dates = [];
    calc = [];
    display = [];
    odo = [];
    for (var i=3; i<data.feed.entry.length; i++) {
        var entry = data.feed.entry[i];
        var dateString = entry.gsx$date.$t;
        var calcString = entry.gsx$calculated.$t;
        var displayString = entry.gsx$display.$t;
        var odoString = entry.gsx$odo.$t;
        if (dateString.length > 0 && calcString.length > 0) {
            dates.push( Date.parse(dateString) );
            calc.push(  parseFloat(calcString) );
            display.push( parseFloat(displayString) );
            odo.push( parseInt(odoString) );
        } 
    }
    scalc = Convolve.conv(calc, Convolve.flat(5));
    sdisp = Convolve.conv(display, Convolve.flat(5));
    Plot.xy({
        xs: [dates], 
        xtype: 'datetime', 
        ys: [calc, scalc, display, sdisp],
        names: ['Calculated', 'Calculated-Smooth', 'Display', 'Display-Smooth'],
        title: 'Mileage v Time', 
        subtitle: '<a href="' + titleUrl + '">google doc source</a>', 
        ylabel: 'Mileage (mpg)', 
        charttype: 'spline', 
        elementId: '#current-mileage'
    });

    Plot.xy({
        xs: [dates], 
        xtype: 'datetime', 
        ys: [odo],
        names: ['odometer'],
        title: 'Odometer v Time', 
        subtitle: '', 
        ylabel: 'Odometer (miles)', 
        charttype: 'spline', 
        elementId: '#odo'
    });
});
