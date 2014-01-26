var url = 
    "https://spreadsheets.google.com/feeds/list" + 
    "/0AgBEpBEeCWyVcnIyd2RWV3dxRThQYXZCdWhNWXBEZmc" +
    "/od6/public/values?alt=json-in-script&callback=?";

var titleUrl = 'https://docs.google.com/spreadsheet/pub?key=0AgBEpBEeCWyVcnIyd2RWV3dxRThQYXZCdWhNWXBEZmc&single=true&gid=0&output=html'
var identity = function(x) { return x };
var fields = [
    {name: 'calculated', parser: parseFloat},
    {name: 'date', parser: Date.parse},
    {name: 'display', parser: parseFloat},
    {name: 'g', parser: parseFloat},
    {name: 'gallons', parser: parseFloat},
    {name: 'odo', parser: parseInt},
    {name: 'station', parser: identity},
    {name: 'total', parser: parseFloat},
    {name: 'trip', parser: parseInt}
]; 

var fieldValues = {};
fields.forEach(function(item) {
    fieldValues[item.name] = [];
});

var fieldsNonZero = function(fieldNames, entry) {
    for (f in fieldNames) {
        if (entry['gsx$' + fieldNames[f]].$t.length < 1) {
            return false;
        }
    }
    return true;
}

var plotxy = function(xsr, ys, names, title, subtitle, ylabel, elementId) {
    Plot.xy({
        xs: xsr,
        xtype: 'datetime',
        ys: ys,
        names: names,
        title: title,
        subtitle: '',
        ylabel: ylabel,
        charttype: 'spline',
        elementId: elementId
    });
}

$.getJSON(url,{}, function (data) { 
    for (var i=3; i<data.feed.entry.length; i++) {
        var entry = data.feed.entry[i];
        if (fieldsNonZero(['date', 'calculated', 'display'], entry)) {
            fields.forEach(function(item) {
                fieldValues[item.name].push(item.parser(entry['gsx$' + item.name].$t));
            });
        } 
    }
    fieldValues.scalc = Convolve.conv(fieldValues.calculated, Convolve.flat(5));
    fieldValues.sdisp = Convolve.conv(fieldValues.display, Convolve.flat(5));
    plotxy([fieldValues.date],
        [fieldValues.calculated, fieldValues.scalc, fieldValues.display, fieldValues.sdisp],
        ['Calculated', 'Calculated-Smooth', 'Display', 'Display-Smooth'],
        'Mileage v Time', '<a href="' + titleUrl + '">google doc source</a>', 
        'Mileage (mpg)', '#current-mileage');
    plotxy([fieldValues.date], [fieldValues.odo], ['odometer'], 'Odometer v Time', '', 
        'Odometer (miles)', '#odo');
    plotxy( [fieldValues.date], [fieldValues.g], ['price'], 'Price v Time', '', 'Price ($/gallon)', 
         '#price');
});
