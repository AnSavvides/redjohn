(function($) {

    "use strict";

    var apiUrl = "http://redjohn.herokuapp.com/api/tweets/",
        suspectNames = {
            partridge: "Brett Partridge",
            smith: "Reede Smith",
            haffner: "Ray Haffner",
            mcallister: "Sheriff McAllister",
            kirkland: "Robert Kirkland",
            bertram: "Gale Bertram",
            stiles: "Brett Stiles"
        },
        deadSuspects = ["partridge", "kirkland"];

    // Adding commas to numbers, making them more readable
    function getPrettyNumber(number) {
        return number.toLocaleString("en-GB");
    }

    // Setting the suspect count
    function setSuspectCount(count) {
        $("#suspect-count").text(count);
    }

    // Sort the suspects from most mentioned to least mentioned
    // and then render them accordingly.
    function renderSuspects(response) {
        var suspectCount = 0,
            suspects = [],
            source = $("#suspect-template").html(),
            template = Handlebars.compile(source),
            $suspectsDiv = $("#suspects"),
            sortedResults = _.sortBy(response.results, function(suspectInfo) { return suspectInfo.count; }),
            context, $suspects;

        _.each(response.results, function(suspectInfo, suspect) {
            var sortedResultsMatch = _.find(sortedResults, function(result) {
                return result.count == suspectInfo.count;
            });

            suspects.push({
                name: suspect,
                prettyName: suspectNames[suspect],
                mentions: getPrettyNumber(suspectInfo.count),
                index: sortedResults.indexOf(sortedResultsMatch),
                dead: _.contains(deadSuspects, suspect)
            });

            suspectCount += parseFloat(suspectInfo.count);
        });

        // Ensure that these are sorted in descending order
        suspects = _.sortBy(suspects, "index").reverse();

        context = { suspects: suspects };
        $suspects = template(context);
        $suspectsDiv.html($suspects);

        setSuspectCount(getPrettyNumber(suspectCount));

        // Now that the suspects have been rendered, let's assign
        // popovers.
        assignSuspectPopovers(response.results);
        $("#footer").css("display", "block");
    }

    // Let's assign a popover to each suspect, to be triggered on hover,
    // showing the latest tweets relevant to the suspect in question.
    function assignSuspectPopovers(results) {
        $(".mentions").each(function() {
            var $suspectMentions = $(this),
                suspectName = $suspectMentions.data("name"),
                content = preparePopoverContent(results[suspectName].most_recent_tweets),
                self = this;

            $(this)
                .popover({
                    title: suspectNames[suspectName] + "<span class='close'>x</span>",
                    content: content,
                    html: true,
                    trigger: "click"
                })
                .click(function() {
                    $(".tweet").linky({
                        mentions: true,
                        hashtags: true,
                        urls: true,
                        linkTo: "twitter"
                    });

                    $(self).next().find(".close").click(function() {
                        $(".popover").remove();
                    });
                });
        });
    }

    function preparePopoverContent(tweets) {
        var context = { tweets: tweets },
            source = $("#tweets-template").html(),
            template = Handlebars.compile(source);

        return template(context);
    }

    function addTotal(response) {
        $("#tweet-count").text(getPrettyNumber(response.results));
    }

    function renderHistogram(response) {
        var data = response.results,
            margin = { top: 10, right: 5, bottom: 30, left: 50 },
            width = 860 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom,
            barWidth = Math.ceil((width - 250) / data.length),
            format = d3.time.format("%Y-%m-%d"),
            firstDate = format.parse(data[0].date),
            lastDate = format.parse($(data).get(-1).date),
            x = d3.time.scale().domain([firstDate, lastDate]).range([0, width - margin.left - margin.right]),
            y = d3.scale.linear().domain([0, d3.max(data, function(datum) { return datum.count; })]).range([height, 0]),
            xAxis = d3.svg.axis().orient("bottom").scale(x).ticks(d3.time.week, 2),
            yAxis = d3.svg.axis().orient("left").scale(y).ticks(4),
            barChart;

        // Creating an svg for our bar chart, ensuring that we have enough
        // margin space for our axes and labels.
        barChart = d3.select("#bar-chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add bars to our chart
        barChart.selectAll("rect")
            .data(data)
            .enter()
            .append("svg:rect")
            .attr("x", function(datum, index) { return x(format.parse(datum.date)); })
            .attr("y", function(datum) { return y(datum.count); })
            .attr("height", function(datum) { return height - y(datum.count); })
            .attr("width", barWidth)
            .attr("fill", "#941100");

        // Add an x axis
        barChart.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis);

        // Add a y axis
        barChart.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    }

    $.ajax({
        url: apiUrl + "suspects/count",
        type: "GET",
        dataType: "jsonp"
    }).done(renderSuspects);

    $.ajax({
        url: apiUrl + "count",
        type: "GET",
        dataType: "jsonp"
    }).done(addTotal);

    $.ajax({
        url: apiUrl + "time_series",
        type: "GET",
        dataType: "jsonp"
    }).done(renderHistogram);

})(jQuery);
