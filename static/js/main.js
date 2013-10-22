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
      };

    function getPrettyNumber(number) {
        return number.toLocaleString("en-GB");
    }

    function addScoresToSuspects(response) {
        var suspectCount = 0,
            suspects = [],
            source = $("#suspect-template").html(),
            template = Handlebars.compile(source),
            $suspectsDiv = $("#suspects"),
            sortedResults = _.sortBy(response.results, function(mentions) { return mentions; }),
            context, $suspects;

        _.each(response.results, function(mentions, suspect) {
            suspects.push({
                name: suspect,
                prettyName: suspectNames[suspect],
                mentions: getPrettyNumber(mentions),
                index: sortedResults.indexOf(mentions)
            });
            suspectCount += parseFloat(mentions);
        });
        
        suspects = _.sortBy(suspects, "index").reverse();

        context = { suspects: suspects };
        $suspects = template(context);
        $suspectsDiv.html($suspects);

        $("#suspect-count").text(getPrettyNumber(suspectCount));
    }

    function addTotal(response) {
        $("#tweet-count").text(getPrettyNumber(response.results));
    }

    $.ajax({
        url: apiUrl + "suspects/count",
        type: "GET",
        dataType: "jsonp"
    }).done(addScoresToSuspects);

    $.ajax({
        url: apiUrl + "count",
        type: "GET",
        dataType: "jsonp"
    }).done(addTotal);

})(jQuery);
