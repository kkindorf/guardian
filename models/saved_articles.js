var mongoose = require("mongoose");
var ArticleSchema = new mongoose.Schema({
    subject: String, 
    articleURL: String, 
    title: String,
    format: String
})

var SavedArticle = mongoose.model('SavedArticle', ArticleSchema);

module.exports = SavedArticle;