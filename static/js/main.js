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
        return number.toLocaleString();
    }

    function addScoresToSuspects(response) {
        var suspectCount = 0,
            suspects = [],
            source = $("#suspect-template").html(),
            template = Handlebars.compile(source),
            $suspectsDiv = $("#suspects"),
            context, $suspects;
        
        _.each(response.results, function(mentions, suspect) {
            suspects.push({
                name: suspect,
                prettyName: suspectNames[suspect],
                mentions: getPrettyNumber(mentions)
            });
            suspectCount += parseFloat(mentions);
        });

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
        dataType: "jsonp",
        success: addScoresToSuspects
    });

    $.ajax({
        url: apiUrl + "count",
        type: "GET",
        dataType: "jsonp",
        success: addTotal
    });

})(jQuery);
