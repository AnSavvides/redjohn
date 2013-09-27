(function($) {

    "use strict";

    function addScoresToSuspects(response) {
        console.log(response);
    }

    $.ajax({
        url: "http://redjohn.herokuapp.com/api/suspects/mentions",
        type: "GET",
        dataType: "jsonp",
        success: addScoresToSuspects
    });

})(jQuery);
