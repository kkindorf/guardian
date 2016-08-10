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
    dataArr = data;
    for (var i = 0;i<data.length;i++){
        console.log(data[i].title)
        $(".saved-results").append("<div class='panel panel-default saved-panel'><div class='panel-heading saved-articles-panel'><button type='button' id='"+i+"' class='btn btn-default delete' aria-label='Left Align'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span></button><h3 class='panel-title'>Search Query Used: "+ data[i].searchTerm+"</h3></div><div class='panel-body'><p>Title: <a href="+data[i].articleURL+" target='_blank'>"+data[i].title+"</a></p><p>Date Searched: "+data[i].date+"</p><p>Format: "+data[i].format+"</p><p class='edit' id='p"+i+"'>Click here: "+data[i].notes+"</p></div></div>");
    }
}

function getAndDisplaySavedArticles(){
    getSavedArticles(displaySavedArticles);
}
var post =[];
var dataArr=[];
var id="";
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
      
})


  $(".saved").click(function(){   
        $(".results").html('');
        $(".saved-results").html('');
        getAndDisplaySavedArticles();
    })
  var putThat;
  $(".saved-results").on("click",".edit", function(){
     putThat = this;
    $(this).attr("contenteditable", "true");
    var pId = $(this).attr("id");
    //console.log(pId);
    id = pId.substring(1, pId.length);
    id = parseInt(id);
    console.log(dataArr[id]._id);
   
    
  })
    .keypress(function(e){
    if(e.which === 13){
    dataArr[id].notes = $(putThat).html();
    console.log(dataArr[id].notes);
        $.ajax('/savedArticles/' + dataArr[id]._id, {
        type: 'PUT',
        data: JSON.stringify(dataArr[id]),
        dataType: 'json',
        contentType: 'application/json',
        success:function(){
          $(putThat).blur();  
        },
        error: function(){
            console.log("There was an error");
        }
    });
    }
    });
$(".saved-results").on("click", ".delete", function(){
    var that = this;
    var result = dataArr[$(this).attr("id")];
  console.log(result._id);
  $.ajax('/savedArticles/' + result._id, {
        type: 'DELETE',
        dataType: 'json',
        success:function(){
           $(that).parents(".panel-default").remove(); 
        },
        error:function(){
            $(that).text("Error");
            $(that).css("background", "red");
            $(that).css("color", "white");
        }
    });

  
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