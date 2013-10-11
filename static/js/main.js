(function($) {

    "use strict";

    var apiUrl = "http://redjohn.herokuapp.com/api/";

    function addScoresToSuspects(response) {
        _.each(response.results, function(mentions, suspect) {
            $("#" + suspect).find(".mentions").text(mentions);
        });
    }

    function addTotal(response) {
        $("#tweet-count").text(response.results);
    }

    $.ajax({
        url: apiUrl + "suspects/mentions",
        type: "GET",
        dataType: "jsonp",
        success: addScoresToSuspects
    });

    $.ajax({
        url: apiUrl + "tweets/count",
        type: "GET",
        dataType: "jsonp",
        success: addTotal
    });

})(jQuery);
