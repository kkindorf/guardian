var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var config = require("./config");
var https = require("https");

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));


var runServer = function(callback){
    mongoose.connect(config.DATABASE_URL, function(err){
        if(err && callback){
            return callback(err);
        }
        //else
        app.listen(config.PORT, function(){
            console.log('Listening on localhost:'+ config.PORT);
            if(callback){
                callback();
            }
        });
    });
};

if(require.main === module){
    runServer(function(err){
        if(err){
            console.log(err);
        }
    })
}

exports.app = app;
exports.runServer = runServer;

var SavedArticles = require("./models/saved_articles");

app.get('/search', function(req, res){
    console.log("hello");
   
   var arr = Object.keys(req.query);
   console.log(arr[0]);
   var url = "https://content.guardianapis.com/search?q="+arr[0]+"&api-key=b3970af8-30fc-4f88-a6d0-2e93e044a43c";
   
   https.get(url, function(resp){
       //readable stream
       res.headers = resp.headers;
       resp.pipe(res);
   })
});

app.get('/savedArticles', function(req, res){
    SavedArticles.find(function(err, articles){
        if(err){
            return res.status(500).json({
                message: 'Internal Server error'
            })
        }
        res.json(articles)
    });
});

app.post('/savedArticles', function(req, res){
    //console.log(req.params);
    SavedArticles.create({
        //body is an object in our request json object
        searchTerm: req.body.searchTerm,
        subject: req.body.subject,
        articleURL: req.body.articleURL,
        title: req.body.title,
        format: req.body.format,
        notes: ""
        
    }, function(err, article){
        if(err){
            return res.status(500).json({
                message: err
            });
        }
        res.status(201).json(article);
    });
});

app.put('/savedArticles/:id', function(req, res){
    var article = req.body;
    console.log(req.body);
    console.log(req.params);
    var id = req.params.id;
    var newNotes = req.body.notes;
    console.log(newNotes);
    SavedArticles.findByIdAndUpdate(id, 
    {
        searchTerm: req.body.searchTerm,
        subject: req.body.subject,
        articleURL: req.body.articleURL,
        title: req.body.title,
        format: req.body.format,
        notes: newNotes
    },
     function(err, data){
        if (err) {
      res.status(500).json({
          message: 'Internal Server Error'
      });
        }

        res.status(200).json(
        {
             _id:id, 
             searchTerm: req.body.searchTerm,
             subject: req.body.subject,
             articleURL: req.body.articleURL,
             title: req.body.title,
             format: req.body.format,
             notes: newNotes
        });

    })
})

app.delete('/savedArticles/:id', function(req, res){
    console.log(req.params.id);
   var id = req.params.id;
   SavedArticles.findByIdAndRemove(id, function(error){
       if(error){
           return res.status(400).json({
               message: "you did not select a proper Id"
           })
       }
       res.status(200).json(id);
   })
})
app.use('*', function(req, res){
    res.status(404).json({
        message: 'Not Found'
    })

})

