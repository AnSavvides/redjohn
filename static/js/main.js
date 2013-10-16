(function($) {

    "use strict";

    var apiUrl = "http://redjohn.herokuapp.com/api/tweets/";

    function getPrettyNumber(number) {
        return number.toLocaleString();
    }

    function addScoresToSuspects(response) {
        var suspectCount = 0;

        _.each(response.results, function(mentions, suspect) {
            $("#" + suspect).find(".mentions").text(getPrettyNumber(mentions) + " mentions");
            suspectCount += parseFloat(mentions);
        });

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
