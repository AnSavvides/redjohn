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
    }

    // Let's assign a popover to each suspect, to be triggered on hover,
    // showing the latest tweets relevant to the suspect in question.
    function assignSuspectPopovers(results) {
        $(".mentions").each(function() {
            var $suspectMentions = $(this),
                suspectName = $suspectMentions.data("name"),
                content = preparePopoverContent(results[suspectName].most_recent_tweets);

            $(this)
                .popover({
                    title: suspectNames[suspectName],
                    content: content,
                    html: true,
                    trigger: "hover"
                })
                .mouseover(function() {
                    $(".tweet").linky({
                        mentions: true,
                        hashtags: true,
                        urls: true,
                        linkTo: "twitter"
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

})(jQuery);
