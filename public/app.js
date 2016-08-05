$( document ).ready(function() {
    var searchTerm = "";

  $("form").submit(function(e){
    e.preventDefault();
    searchTerm = $("#term").val();
    $('input').val('');
    $(".results").html('');
    $.getJSON("https://content.guardianapis.com/search?q="+searchTerm+"&order-by=relevance&api-key=b3970af8-30fc-4f88-a6d0-2e93e044a43c", function(data){
      var resultsArr = data.response.results;
      for(var i = 0; i <resultsArr.length; i++){
          $(".results").append('<div class="panel panel-default"><div class="panel-body"><button type="button" class="btn btn-default save">Save for Later</button><p>'+resultsArr[i].sectionName+'</p><p><a                                                          href='+resultsArr[i].webUrl+'target=_blank>'+resultsArr[i].webTitle+'</a></p>                                  </div></div>');
      }
  
   })
})
});