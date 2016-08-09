
function getSavedArticles(callback){
    $.ajax({
        type: 'GET',
        url: "https://kkindorf-node-kkindorf.c9users.io/savedArticles",
        success: function(data){
            console.log(data);
            callback(data);
        }
    });
};

function displaySavedArticles(data){
    for (var i = 0;i<data.length;i++){
        console.log(data[i].title)
        $(".saved-results").append("<div class='panel panel-default saved-panel'><div class='panel-heading saved-articles-panel'><button type='button' class='btn btn-default delete' aria-label='Left Align'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button><h3 class='panel-title'>Search Query Used: "+ data[i].searchTerm+"</h3></div><div class='panel-body'><p>Title: <a href="+data[i].articleURL+" target='_blank'>"+data[i].title+"</a></p><p>  Date Searched: "+data[i].date+"</p><p>Format: "+data[i].format+"</p></div></div>");
    }
}

function getAndDisplaySavedArticles(){
    getSavedArticles(displaySavedArticles);
}
$(document).ready(function() {
    var searchTerm = "";
    var form = $("form");
    var webTitle ="";
  form.submit(function(e){
    e.preventDefault();
    searchTerm = $("#term").val();
    $('input').val('');
    $(".results").html('');
    $(".saved-results").html('');
    
    //var url ="https://kkindorf-node-kkindorf.c9users.io/search";
    var ajax = $.ajax('/search?' + searchTerm, {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(function (data){
        var resultsArr = data.response.results;
      for(var i = 0; i <resultsArr.length; i++){
          $(".results").append('<div class="panel panel-default"><div class="panel-body"><button type="button"  class="btn btn-default save">Save for Later</button><p>'+resultsArr[i].sectionName+'</p><input type="hidden" name="sectionName" value='+resultsArr[i].sectionName+'><input type="hidden" name="searchTerm" value='+searchTerm+'><input type="hidden" name="url" value='+resultsArr[i].webUrl+'><input type="hidden" name="title" value='+resultsArr[i].webTitle+'><input type="hidden" name="type" value='+resultsArr[i].type+'><p><a                                                          href="'+resultsArr[i].webUrl+'" target="_blank">'+resultsArr[i].webTitle+'</a></p>                                  </div></div>');
      }
    });
       console.log($(".save").find("p a:last").attr('href'));  
})

console.log(webTitle);
  $(".saved").click(function(){   
        $(".results").html('');
        $(".saved-results").html('');
        getAndDisplaySavedArticles();
    })
  
  $(".saved-results").on("click",".saved-panel", function(){
    $(this).find(".panel-title").attr("contenteditable", "true");
  })
    .keypress(function(e){
    if(e.which === 13){
       $(".panel-title").blur();
        //ajax update
      return false;
    }
  });
$(".saved-results").on("click", ".delete", function(){
  //ajax delete
$(this).parents(".panel-default").remove();
  
});
$(".results").on("click", ".save", function(){
      $(this).text("Saved!");
      $(this).css("color", "white");
      $(this).css("background", "green");
       var search = $("[name=searchTerm]").val();
      var subject = $("[name=sectionName]").val();
      var articleURL = $("[name=url]").val();
      var title = $("[name=title]").val();
      var format = $("[name=type]").val();
      
      var article = {
         "searchTerm": search,
         "subject":  subject,
         "articleURL": articleURL,
         "title": title,   
         "format": format
      }

  $.ajax({
      type: 'POST',
      url: 'https://kkindorf-node-kkindorf.c9users.io/savedArticles',
      data: JSON.stringify(article),
        dataType: 'json',
        contentType: 'application/json' ,
    
      success: function(data){
          console.log(data);
          console.log(data.searchTerm);
      }, 
      error: function() {
          alert("there was an error");
      }
  });   
});
});