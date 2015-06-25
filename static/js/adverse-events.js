'use strict';

/**
 * AdverseEvents object.
 *
 * @param {String} gridEl
 *  The grid element name.
 */
function AdverseEvents(gridEl) {
    var datatable, pieChart, seriesChart;
    var firstRun = true;
    var $table = $(gridEl);
    var data = [];
    var me = this;
    var api = 'https://api.fda.gov/drug/event.json';
    var apiKey ='xKEbXQ6J58IGdIF5JhcBiWQOfDFWjjRTYbOYtDOv';

    /**
     * Initialize the AdverseEvents object.
     *
     * @param {String} gridEl
     *  The grid element name.
     */
    this.initialize = function(gridEl) {
        if (firstRun) {
            // Set default values for the date pickers
            $('.start-date').datepicker('setDate', new Date(new Date().setMonth(new Date().getMonth() - 36)));
            $('.end-date').datepicker('setDate', new Date());

            firstRun = false;
        }

        this.createGrid(gridEl);
        this.configureHandlers();
    };

    /**
     * Pad a string so many characters out to the left.
     *
     * @param {Integer} i
     *  The number of spaces to the left to pad.
     * @param {String} c
     *  The charater(s) to padd with.
     * @param {String} s
     *  The original string to be padded.
     * @returns
     *  A padded string.
     */
    this.padLeft = function(i, c, s) {
        var pad = '';
        for (var j = 0; j < i; j++) {
            pad += c;
        }
        return pad.substring(0, pad.length - s.length) + s;
    };

    /**
     * Converts a date to a format acceptable by the API.
     * For example:
     *  06/21/2015 => 20150621
     *
     * @param {Date} date
     *  The date object
     * @returns
     *  A formatted string
     */
    this.convertDate = function(date) {
        return date.getFullYear().toString()
            + this.padLeft(2, '0', (date.getMonth() + 1).toString())
            + this.padLeft(2, '0', date.getDate().toString());
    };

    /**
     * Create all necessary charts.
     */
    this.createCharts = function() {
        this.createSeriousnessChart();
        this.createReportedEvents();
    };

    /**
     * Create the chart for serious incidents.
     */
    this.createSeriousnessChart = function() {
        var startDate = me.convertDate(new Date($('.start-date').val()));
        var endDate = me.convertDate(new Date($('.end-date').val()));
        var search = 'receivedate:[' + startDate + '+TO+' + endDate + ']';
        var params =
            'api_key=' + apiKey
            + '&search=' + search
            + '&count=serious';

        $.getJSON(api, params, function(response) {
            var filter = crossfilter($.map(response.results, function (value, index) {
                return [value];
            }));

            var dimension = filter.dimension(function (d) {
                if (d.term === 1) {
                    return 'Serious';
                }
                return 'Less serious';
            });

            var group = dimension.group().reduceSum(function (d) {
                return d.count;
            });

            pieChart = dc.pieChart('#pie-chart');
            pieChart
                .width(200)
                .height(200)
                .slicesCap(4)
                .innerRadius(25)
                .dimension(dimension)
                .group(group)
                .legend(dc.legend());
            pieChart.render();
        });
    };

    /**
     * Create the chart for reported events.
     */
    this.createReportedEvents = function() {
        var startDate = me.convertDate(new Date($('.start-date').val()));
        var endDate = me.convertDate(new Date($('.end-date').val()));
        var search = 'receivedate:[' + startDate + '+TO+' + endDate + ']';
        var params =
            'api_key=' + apiKey
            + '&search=' + search
            + '&count=receivedate';

        $.getJSON(api, params, function(response) {
            var filter = crossfilter($.map(response.results, function (value, index) {
                return [value];
            }));

            var dimension = filter.dimension(function (d) {
                return new Date(d.time.substring(0, 4) + '/' + d.time.substring(4, 6) + '/' + d.time.substring(6, 8));
            });

            var group = dimension.group().reduceSum(function (d) {
                return d.count;
            });

            seriesChart = dc.lineChart('#series-chart');
            seriesChart
                .width(640)
                .height(200)
                .x(d3.time.scale().domain([new Date($('.start-date').val()), new Date($('.end-date').val())]))
                .round(d3.time.month.round)
                .xUnits(d3.time.months)
                .renderArea(true)
                .clipPadding(10)
                .brushOn(false)
                .mouseZoomable(true)
                .elasticY(true)
                .dimension(dimension)
                .group(group);
            seriesChart.margins().left = 42;
            seriesChart.render();
        });
    };

    /**
     * Create our datatable grid.
     **/
    this.createGrid = function() {
        $.fn.dataTableExt.pager.numbers_length = 5;
        datatable = $table.DataTable({
            destroy: true,
            autoWidth: false,
            serverSide: true,
            searching: false,
            displayLength: 25,
            fnServerData: this.processServerDataResponse,
            columns: [
                { data: 'safetyreportid' },
                {
                    render: function (row, type, val, meta) {
                        var drugs = [];

                        if (val.patient && val.patient.drug && val.patient.drug.length > 0) {
                            for (var i = 0; i < val.patient.drug.length; i++) {
                                var drug = val.patient.drug[i];
                                if (!drug.medicinalproduct) {
                                    continue;
                                }

                                var exists = false;
                                for (var j = 0; j < drugs.length; j++) {
                                    if (drugs[j] === drug.medicinalproduct) {
                                        exists = true;
                                        break;
                                    }
                                }

                                if (!exists) {
                                    drugs.push(drug.medicinalproduct);
                                }
                            }
                        }

                        var html = '';
                        if (drugs.length > 0) {
                            var less = drugs.length - 1;
                            html += drugs[0];

                            if (less > 1) {
                                html += ' (<a href="#" title="'
                                        + drugs.splice(1, less).join('\n')
                                        + '">+'
                                        + less
                                        + ' more</a>)';
                            }
                        }
                        return html;
                    }
                },
                {
                    render: function (row, type, val, meta) {
                        var reactions = [];

                        if (val.patient && val.patient.reaction && val.patient.reaction.length > 0) {
                            for (var i = 0; i < val.patient.reaction.length; i++) {
                                var reaction = val.patient.reaction[i];
                                if (!reaction.reactionmeddrapt) {
                                    continue;
                                }

                                var exists = false;
                                for (var j = 0; j < reactions.length; j++) {
                                    if (reactions[j] === reaction.reactionmeddrapt) {
                                        exists = true;
                                        break;
                                    }
                                }

                                if (!exists) {
                                    reactions.push(reaction.reactionmeddrapt);
                                }
                            }
                        }

                        var html = '';
                        if (reactions.length > 0) {
                            var less = reactions.length - 1;
                            html += reactions[0];

                            if (less > 1) {
                                html += ' (<a href="#" title="'
                                        + reactions.splice(1, less).join('\n')
                                        + '">+'
                                        + less
                                        + ' more</a>)';
                            }
                        }
                        return html;
                    }
                },
                {
                    data: 'receiver.receiverorganization',
                    render: function (row, type, val, meta) {
                        if (val.receiver && val.receiver.receiverorganization) {
                            return val.receiver.receiverorganization;
                        }

                        return '';
                    }
                },
                {
                    data: 'primarysourcecountry',
                    render: function (row, type, val, meta) {
                        if (val.primarysourcecountry) {
                            return val.primarysourcecountry;
                        }

                        if (val.primarysource && val.primarysource.reportercountry) {
                            return val.primarysource.reportercountry;
                        }

                        return '';
                    }
                }
            ]
        });
    };

    /**
     * Handles click events on a data table row.
     *
     * @param {Object} event
     *  The click event
     */
    this.onRowClick = function(event) {
        var data = datatable.row(this).data();
        $table.find('tr').removeClass('info');
        $(this).addClass('info');
    };

    /**
     * Configures handlers for the table.
     */
    this.configureHandlers = function() {
        $table.on('click', 'tr', this.onRowClick);
        $('.date').on('changeDate', function (e) {
            if (datatable) {
                datatable.ajax.reload();
            }
        });
    };

    /**
     * Handles requests when the grid is updated. The FDA API takes in different
     * parameters from what DataTables is expecting so we manually set them
     * here. This allows the 'Showing {x} to {y} of {x}' information to be
     * properly displayed.
     *
     * @param {Object} source
     * @param {Object} data
     * @param {Function} callback
     */
    this.processServerDataResponse = function(source, data, callback) {
        var start = data[3].value;
        var limit = data[4].value;
        var startDate = me.convertDate(new Date($('.start-date').val()));
        var endDate = me.convertDate(new Date($('.end-date').val()));
        var search = 'receivedate:[' + startDate + '+TO+' + endDate + ']';
        var params = 'api_key=' + apiKey
            + '&skip=' + start
            + '&limit=' + limit
            + '&search=' + search;

        $.getJSON(api, params, function(response) {
            response.draw  = data[0].value;
            response.recordsTotal = response.meta.results.total;
            response.recordsFiltered = response.meta.results.total;
            response.data = response.results;
            callback(response);
            data = response.results;
            me.createCharts(data);
        });
    };

    this.initialize();
}

$(function () {
    var adverseEvents = new AdverseEvents('#grid');
});
