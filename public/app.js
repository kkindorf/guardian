//possible url endpoint from our api
// /api/<user>/saved-articles

var MOCK_SAVED_ARTICLES = {
    "saved_articles": [
        {
            "id": "1111111",
            "searchTerm": "Dogs",
            "articleURL":"#",
            "title": "All Dogs Really Do Go To Heaven.",
            "format": "Article",
            "dateSearched": "Feb-01-1999"
        },
        {
            "id": "22222222",
            "searchTerm": "Cats",
            "articleURL":"#",
            "title": "Cats Do Not Really Have Nine Lives, claims respected dentist.",
            "format": "blog",
            "dateSearched": "Feb-03-1999"
        },
        {
            "id": "33333333",
            "searchTerm": "Tom Brady",
            "articleURL":"#",
            "title": "Tom Brady Seen at Gillette Speaking and Smiling at Goodell's Jokes.",
            "format": "Article",
            "dateSearched": "Feb-05-1999"
        },
        {
            "id": "4444444",
            "searchTerm": "Food Truck",
            "articleURL":"#",
            "title": "Will New Burger King Food Truck Destroy the novel idea of eating food prepared in the back of a truck?",
            "format": "blog",
            "dateSearched": "Feb-04-1999"
        }
    ]
};
function getSavedArticles(callback){
    callback(MOCK_SAVED_ARTICLES);
}
function displaySavedArticles(data){
    for (var i = 0;i<data.saved_articles.length;i++){
        $(".saved-results").append("<div class='panel panel-default'><div class='panel-heading saved-articles-panel'><button type='button' class='btn btn-default delete' aria-label='Left Align'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button><h3 class='panel-title'>Search Query Used: "+ data.saved_articles[i].searchTerm+"</h3></div><div class='panel-body'><p>"+data.saved_articles[i].title+"</p><p>"+data.saved_articles[i].dateSearched+"</p><p>"+data.saved_articles[i].format+"</p></div></div>");
    }
}

function getAndDisplaySavedArticles(){
    getSavedArticles(displaySavedArticles);
}
$( document ).ready(function() {
    var searchTerm = "";

  $("form").submit(function(e){
    e.preventDefault();
    searchTerm = $("#term").val();
    $('input').val('');
    $(".results").html('');
    $("saved-results").html('');
    $.getJSON("https://content.guardianapis.com/search?q="+searchTerm+"&order-by=relevance&api-key=b3970af8-30fc-4f88-a6d0-2e93e044a43c", function(data){
      var resultsArr = data.response.results;
      for(var i = 0; i <resultsArr.length; i++){
          $(".results").append('<div class="panel panel-default"><div class="panel-body"><button type="button" class="btn btn-default save">Save for Later</button><p>'+resultsArr[i].sectionName+'</p><p><a                                                          href='+resultsArr[i].webUrl+' target="_blank">'+resultsArr[i].webTitle+'</a></p>                                  </div></div>');
      }
  
   })
})
   $(".saved").click(function(){   
        $(".results").html('');
        getAndDisplaySavedArticles();
    })
});