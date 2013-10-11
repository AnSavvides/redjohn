(function($) {

    "use strict";

    var apiUrl = "http://redjohn.herokuapp.com/api/tweets";

    function addScoresToSuspects(response) {
        _.each(response.results, function(mentions, suspect) {
            $("#" + suspect).find(".mentions").text(mentions);
        });
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
