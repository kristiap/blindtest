$(function () {
    $("div.results").sort(function () {
        return Math.random() * 10 > 5 ? 1 : -1;
    }).each(function () {
        $(this).appendTo("body");
    });

    $("html").click(function() {
       $("img").show();
    });
});

