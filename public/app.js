
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
        $(".saved-results").append("<div class='panel panel-default saved-panel'><div class='panel-heading saved-articles-panel'><button type='button' class='btn btn-default delete' aria-label='Left Align'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button><h3 class='panel-title'>Search Query Used: "+ data[i].searchTerm+"</h3></div><div class='panel-body'><p>Title: <a href="+data[i].articleURL+" target='_blank'>"+data[i].title+"</a></p><p>Date Searched: "+data[i].date+"</p><p>Format: "+data[i].format+"</p></div></div>");
    }
}

function getAndDisplaySavedArticles(){
    getSavedArticles(displaySavedArticles);
}
var post =[];
$(document).ready(function() {
    var searchTerm = "";
    var form = $("form");
    var webTitle ="";
    var resultsArr = [];
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
        resultsArr = data.response.results;
      for(var i = 0; i <resultsArr.length; i++){
          $(".results").append('<div class="panel panel-default"><div class="panel-body"><button type="button"  class="btn btn-default save" id="'+i+'">Save for Later</button><p>'+resultsArr[i].sectionName+'</p><p><a href="'+resultsArr[i].webUrl+'" target="_blank">'+resultsArr[i].webTitle+'</a></p></div></div>');
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
//if I search for the same query more than once, it 
//and save an article on the second search a query I used before it 
//saves the first article I saved not the new article
$(".results").on("click", ".save", function(){
    var that = this;
    var result = resultsArr[$(this).attr("id")];
    var article = {
         searchTerm: searchTerm,
         subject:  result.sectionName,
         articleURL: result.webUrl,
         title: result.webTitle,   
         format: result.type
      };
       $(this).attr("disabled", "true");
       $(this).text("Saving...");
       


  $.ajax({
      type: 'POST',
      url: 'https://kkindorf-node-kkindorf.c9users.io/savedArticles',
      data: JSON.stringify(article),
        dataType: 'json',
        contentType: 'application/json',
    
      success: function(data){
          console.log("success", data);
          
          $(that).attr("disabled", "false");
          $(that).text("Saved!");
          $(that).css("color", "white");
          $(that).css("background", "green");
      }, 
      error: function(err) {
          console.log("error", err);
          $(that).attr("disabled", "false");
          $(that).text("Error");
          $(that).css("color", "white");
          $(that).css("background", "red");
      }
  });   
});
});