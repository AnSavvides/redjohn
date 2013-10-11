(function($) {

    "use strict";

    function addScoresToSuspects(response) {
        _.each(response.results, function(mentions, suspect) {
            $("#" + suspect).find(".mentions").text(mentions);
        });
    }

    function addTotal(response) {
        $("#tweet-count").text(response.results);
    }

    $.ajax({
        url: "http://redjohn.herokuapp.com/api/suspects/mentions",
        type: "GET",
        dataType: "jsonp",
        success: addScoresToSuspects
    });

    $.ajax({
        url: "http://redjohn.herokuapp.com/api/tweets/count",
        type: "GET",
        dataType: "jsonp",
        success: addTotal
    });

})(jQuery);
