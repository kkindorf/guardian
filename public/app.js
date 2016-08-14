//JS variables
var post = [];
var dataArr = [];
var id = "";
var count = 1;
var searchTerm = "";
var webTitle = "";
var resultsArr = [];

//jQuery Variables
var form = $("form");
var savedResults = $(".saved-results");
var resultsButtons = $(".results-buttons");
var nextButton = $(".next");
var previousButton = $(".previous");
var input = $("input");
var results = $(".results");
var savedResults = $(".saved-results");
var savedArticles = $(".saved");

function getSavedArticles(callback) {
    $.ajax({
        url: "/savedArticles",
        success: function(data) {
            callback(data);
        }
    });
};

function displaySavedArticles(data) {
    dataArr = data;
    var newDate = "";
    for (var i = 0; i < data.length; i++) {
        newDate = data[i].date.substring(0, 10);
        var year = newDate.slice(0, 5);
        newDate = newDate.substring(5, newDate.length) + "-" + year.substring(0, year.length - 1);
        savedResults.append("<div class='panel panel-default saved-panel'><div class='panel-heading saved-articles-panel'><button type='button' id='" + i + "' class='btn btn-default delete' aria-label='Left Align'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button><h5 class='panel-title'>Search Query Used: " + data[i].searchTerm + "</h5></div><div class='panel-body'><p>Title: <a href=" + data[i].articleURL + " target='_blank'>" + data[i].title + "</a></p><p>Date Searched: " + newDate + "</p><p>Format: " + data[i].format + "</p><p class='instructions'>Click the box to add notes:</p><p class='edit' id='p" + i + "'>" + data[i].notes + "</p></div></div>");

    }
}

function getAndDisplaySavedArticles() {
    getSavedArticles(displaySavedArticles);
}

$(document).ready(function() {

    form.submit(function(e) {
        e.preventDefault();
        resultsButtons.hide();
        nextButton.hide();
        previousButton.hide();
        searchTerm = $("#term").val();
        input.val("");
        results.html("");
        savedResults.html("");
        var ajax = $.ajax("/search?" + searchTerm + "&" + count, {
            type: "GET",
            dataType: "json"
        });
        ajax.done(function(data) {
            resultsArr = data.response.results;
            for (var i = 0; i < resultsArr.length; i++) {
                results.append("<div class='panel panel-default'><div class='panel-body'><button type='button'  class='btn btn-default save' id='" + i + "'>Save</button><p>" + resultsArr[i].sectionName + "</p><p><a href='" + resultsArr[i].webUrl + "' target='_blank'>" + resultsArr[i].webTitle + "</a></p></div></div>");
            }
            resultsButtons.show();
            nextButton.show();
            previousButton.show();
        });
    })


    savedArticles.click(function() {
        resultsButtons.hide();
        nextButton.hide();
        previousButton.hide();
        results.html("");
        savedResults.html("");
        $(this).blur();
        getAndDisplaySavedArticles();
    })

    var putThat;
    savedResults.on("click", ".edit", function() {
            putThat = this;
            $(this).attr("contenteditable", "true");
            var pId = $(this).attr("id");
            id = pId.substring(1, pId.length);
            id = parseInt(id);
        })
        .keypress(function(e) {
            if (e.which === 13) {
                dataArr[id].notes = $(putThat).html();
                $.ajax("/savedArticles/" + dataArr[id]._id, {
                    type: "PUT",
                    data: JSON.stringify(dataArr[id]),
                    dataType: "json",
                    contentType: "application/json",
                    success: function() {
                        $(putThat).blur();
                    },
                    error: function() {
                        console.log("There was an error");
                    }
                });
                e.preventDefault();
            }

        });

    savedResults.on("click", ".delete", function() {

        var that = this;
        var result = dataArr[$(this).attr("id")];
        $.ajax("/savedArticles/" + result._id, {
            type: "DELETE",
            dataType: "json",
            success: function() {
                $(that).parents(".panel-default").animate({
                    height: 0,
                    opacity: 0
                }, 1000, function() {
                    $(this).remove();
                });
            },
            error: function() {
                $(that).text("Error");
                $(that).css("background", "red");
                $(that).css("color", "white");
            }
        });
    });


    results.on("click", ".save", function() {
        var that = this;
        var result = resultsArr[$(this).attr("id")];
        var article = {
            searchTerm: searchTerm,
            subject: result.sectionName,
            articleURL: result.webUrl,
            title: result.webTitle,
            format: result.type
        };
        $(this).attr("disabled", "true");
        $(this).text("Saving...");

        $.ajax({
            type: "POST",
            url: "/savedArticles",
            data: JSON.stringify(article),
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                $(that).attr("disabled", null);
                $(that).text("Saved!");
                $(that).css("color", "white");
                $(that).css("background", "green");
            },
            error: function(err) {
                $(that).attr("disabled", null);
                $(that).text("Error");
                $(that).css("color", "white");
                $(that).css("background", "red");
            }
        });
    });
    nextButton.on("click", function() {
        count++;
        results.html("");
        resultsButtons.hide();
        nextButton.hide();
        previousButton.hide();
        var ajax = $.ajax("/search?" + searchTerm + "&" + count, {
            type: "GET",
            dataType: "json"
        });
        ajax.done(function(data) {
            resultsArr = data.response.results;
            for (var i = 0; i < resultsArr.length; i++) {
                results.append("<div class='panel panel-default'><div class='panel-body'><button type='button'  class='btn btn-default save' id='" + i + "'>Save</button><p>" + resultsArr[i].sectionName + "</p><p><a href='" + resultsArr[i].webUrl + "' target='_blank'>" + resultsArr[i].webTitle + "</a></p></div></div>");
            }
            resultsButtons.show();
            nextButton.show();
            previousButton.show();
        });
    })
    previousButton.on("click", function() {
        
        if (count === 1) {
            return false;
        } else {
            count--;
            results.html("");
            resultsButtons.hide();
            nextButton.hide();
            previousButton.hide();
            var ajax = $.ajax("/search?" + searchTerm + "&" + count, {
                type: "GET",
                dataType: "json"
            });
            ajax.done(function(data) {
                resultsArr = data.response.results;
                for (var i = 0; i < resultsArr.length; i++) {
                    results.append("<div class='panel panel-default'><div class='panel-body'><button type='button'  class='btn btn-default save' id='" + i + "'>Save</button><p>" + resultsArr[i].sectionName + "</p><p><a href='" + resultsArr[i].webUrl + "' target='_blank'>" + resultsArr[i].webTitle + "</a></p></div></div>");
                }
                resultsButtons.show();
                nextButton.show();
                previousButton.show();
            });
        }
    })
});
