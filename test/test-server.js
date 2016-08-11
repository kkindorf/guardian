global.DATABASE_URL = 'mongodb://localhost/guardian-test';

var chai = require('chai');

var chaiHttp = require('chai-http');
var server = require('../server.js');
var should = chai.should();
var SavedArticle = require('../models/saved_articles');
var app = server.app;
chai.use(chaiHttp);


describe('Guardian', function(){
    
     before(function(done) {
                server.runServer(function() {
                    SavedArticle.create(
                    {
                        searchTerm: 'puppies',
                        subject: 'dogs', 
                        articleURL: 'www.url.com', 
                        title: 'This title',
                        format: 'article',
                        notes: 'These are some notes'
                    },
                    {
                        searchTerm: "cars and trains",
                        subject: "cars", 
                        articleURL: "www.this.com", 
                        title: "New title",
                        format: "article",
                        notes: "These are 3 notes"  
                    },
                    {
                        searchTerm: "boats",
                        subject: "boats", 
                        articleURL: "www.google.com", 
                        title: "A third title",
                        format: "blog",
                        notes: "These are more notes"  
                    }, function() {
                        done();
                    });
                });
            });
            
    it('should respond with a status code 200', function(done){
        chai.request(app)
        .get('/')
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.html;
            done();
        })
        
    });
    
    var articles =['This title', 'New title', 'A third title'];
    it('should list articles on GET', function(done){
        chai.request(app)
        .get('/savedArticles')
        .end(function(err, res){
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            console.log(res.body);
            res.body.should.have.length(3);
            for(var i = 0; i < res.body.length; i++){
                /*articles.should.include(res.body[i].searchTerm)
                articles.should.include(res.body[i].subject)
                articles.should.include(res.body[i].articleURL)
                articles.should.include(res.body[i].title)
                articles.should.include(res.body[i].format)
                articles.should.include(res.body[i].notes)*/
                res.body[i].should.be.a('object');
                res.body[i].should.have.property('_id');
                res.body[i].should.have.property('searchTerm');
                res.body[i].should.have.property('subject');
                res.body[i].should.have.property('articleURL');
                res.body[i].should.have.property('title');
                res.body[i].should.have.property('format');
                res.body[i].should.have.property('notes');
                res.body[i].searchTerm.should.be.a('string');
                res.body[i].subject.should.be.a('string');
                res.body[i].articleURL.should.be.a('string');
                res.body[i].title.should.be.a('string');
                res.body[i].format.should.be.a('string');
                res.body[i].notes.should.be.a('string');
            };
            done();
        })
    })
    
    it('should add an article on POST', function(done){
        chai.request(app)
        .post('/savedArticles')
        .send({
            searchTerm: "This is a boat",
            subject: "more boats", 
            articleURL: "www.anotherboat.com", 
            title: "A new title",
            format: "article",
            notes: "" 
        })
        .end(function(err, res){
            should.equal(err, null);
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('searchTerm');
            res.body.should.have.property('subject');
            res.body.should.have.property('articleURL');
            res.body.should.have.property('title');
            res.body.should.have.property('format');
            res.body.should.have.property('notes');
            res.body.searchTerm.should.be.a('string');
            res.body.subject.should.be.a('string');
            res.body.articleURL.should.be.a('string');
            res.body.title.should.be.a('string');
            res.body.format.should.be.a('string');
            res.body.notes.should.be.a('string');
            res.body.searchTerm.should.equal('This is a boat');
            res.body.subject.should.equal('more boats');
            res.body.articleURL.should.equal('www.anotherboat.com');
            res.body.title.should.equal('A new title');
            res.body.format.should.equal('article');
            res.body.notes.should.equal('');
            done();
        })
    })
    
    it('should edit an article on PUT', function(done){
        var id;
        chai.request(app)
        .get('/savedArticles')
        .end(function(err, res){
            id = res.body[0]._id;
            chai.request(app)
            .put('/savedArticles/'+id)
            .send({
            searchTerm: "This is a boat",
            subject: "more boats", 
            articleURL: "www.anotherboat.com", 
            title: "A new title",
            format: "article",
            notes: "These are newly updated notes"
            })
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('searchTerm');
                res.body.should.have.property('subject');
                res.body.should.have.property('articleURL');
                res.body.should.have.property('title');
                res.body.should.have.property('format');
                res.body.should.have.property('notes');
                res.body.subject.should.be.a('string');
                res.body.searchTerm.should.be.a('string');
                res.body.title.should.be.a('string');
                res.body.articleURL.should.be.a('string');
                res.body.format.should.be.a('string');
                res.body.notes.should.be.a('string');
                res.body.subject.should.equal('more boats');
                res.body.searchTerm.should.equal('This is a boat');
                res.body.articleURL.should.equal('www.anotherboat.com');
                res.body.title.should.equal('A new title');
                res.body.format.should.equal('article');
                res.body.notes.should.equal('These are newly updated notes');
                done();
            })
        })
    })
    
    it('should delete an item on DELETE', function(done){
        var id;
        chai.request(app)
        .get('/savedArticles')
        .end(function(err, res){
            id = res.body[1]._id;
            chai.request(app)
            .delete('/savedArticles/'+id)
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('string');
                res.body.should.equal(id);
                done();
                
            })
            
        })
        
    })
    
});
after(function(done) {
        SavedArticle.remove(function() {
            done();
        });
    });
