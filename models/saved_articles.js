var mongoose = require("mongoose");
var ArticleSchema = new mongoose.Schema({
    searchTerm: String,
    subject: String, 
    articleURL: String, 
    title: String,
    format: String,
    date: { type: Date, default: Date.now }
})

var SavedArticle = mongoose.model('SavedArticle', ArticleSchema);

module.exports = SavedArticle;