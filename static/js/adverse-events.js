$(function () {
    'use strict';

    function AdverseEvents(gridEl) {
        var datatable, pieChart, seriesChart;
        var $table = $(gridEl);
        var data = [];
        var me = this;
        var api = 'https://api.fda.gov/drug/event.json';
        var apiKey ='xKEbXQ6J58IGdIF5JhcBiWQOfDFWjjRTYbOYtDOv';

        this.initialize = function(gridEl) {
            this.createGrid(gridEl);
            this.configureHandlers();
        };

        this.createCharts = function(data) {
            var filter = crossfilter($.map(data, function (value, index) {
                return [value];
            }));

            this.createSeriousnessChart(filter);
            this.createReportedEvents(filter);
            dc.renderAll();
        };

        this.createSeriousnessChart = function(filter) {
            var dimension = filter.dimension(function (d) {
                if (d.serious === '1') {
                    return 'Serious';
                }
                return 'Less serious';
            });

            var group = dimension.group().reduceSum(function (d) {
                return 1;
            });

            pieChart = dc.pieChart('#pie-chart');
            pieChart
                .width(200)
                .height(200)
                .slicesCap(4)
                .innerRadius(50)
                .dimension(dimension)
                .group(group)
                .legend(dc.legend());

        };

        this.createReportedEvents = function(filter) {
            var dimension = filter.dimension(function (d) {
                return new Date(d['@epoch'] * 1000).setDate(1);
            });

            var group = dimension.group().reduceSum(function (d) {
                return 1;
            });

            seriesChart = dc.lineChart('#series-chart');
            seriesChart
                .width(400)
                .height(200)
                .x(d3.time.scale().domain([new Date('1/1/2004'), new Date()]))
                .round(d3.time.month.round)
                .xUnits(d3.time.months)
                .renderArea(true)
                .brushOn(false)
                .yAxisLabel('y-axis')
                .elasticY(true)
                .dimension(dimension)
                .group(group);
        };

        this.createGrid = function() {
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
        }

        this.onRowClick = function(event) {
            var data = datatable.row(this).data();
            $table.find('tr').removeClass('info');
            $(this).addClass('info');
        }

        // Configures handlers for the table
        this.configureHandlers = function() {
            $table.on('click', 'tr', this.onRowClick);
        }

        /**
          * Handles requests when the grid is updated. The FDA API takes in different
          * parameters from what DataTables is expecting so we manually set them
          * here. This allows the 'Showing {x} to {y} of {x}' information to be
          * properly displayed.
          **/
        this.processServerDataResponse = function(source, data, callback) {
            var start = data[3].value;
            var limit = data[4].value;
            var params = {
                api_key: apiKey,
                skip: start,
                limit: limit
            };

            $.getJSON(api, params, function(response) {
                response.draw  = data[0].value;
                response.recordsTotal = response.meta.results.total;
                response.recordsFiltered = response.meta.results.total;
                response.data = response.results;
                callback(response);
                data = response.results;
                me.createCharts(data);
            });
        }

        this.initialize();
    }

    var adverseEvents = new AdverseEvents('#grid');
});
