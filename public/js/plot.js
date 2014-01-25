var Plot = {}

/**
 * xy(config)
 *
 * An xy plot where config provides the following:
 * x - an array of x-axis values
 * ys - an array of arrays of y-axis values (that correspond to the same x)
 * names - an array of series names
 * title - chart title
 * subtitile - chart subtitle
 * ylabel - duh
 * charttype - 'spline', 'line'
 * elementId - the dom selector where the chart is rendered
 */
Plot.xy = function(config) {
    var zipped = [];
    for (i in config.ys) {
        var y = config.ys[i];
        var serum = [];
        for (j=0; j<y.length; j++) {
            serum.push([config.x[j], y[j]]);
        }
        zipped.push({data: serum, name: config.names[i]});
    }

    $(config.elementId).highcharts({
        chart: {
            type: config.charttype,
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
            type: config.xtype
        },
        yAxis: {
            title: { text: config.ylabel },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        series: zipped,
        legend: {
            align: 'right',
            layout: 'vertical',
            verticalAlign: 'middle'
        }
    });
}
