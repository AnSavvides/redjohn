(function($) {

    "use strict";

    var apiUrl = "http://redjohn.herokuapp.com/api/tweets/";

    function addScoresToSuspects(response) {
        var suspectCount = 0;

        _.each(response.results, function(mentions, suspect) {
            $("#" + suspect).find(".mentions").text(mentions + " mentions");
            suspectCount += parseFloat(mentions);
        });

        $("#suspect-count").text(suspectCount);
    }

    function addTotal(response) {
        $("#tweet-count").text(response.results);
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
