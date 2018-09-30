var express = require("express");
var cheerio = require("cheerio");
var request = require("request");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));


var databaseUrl = "scraper";
var collections = ["scrapedData"]
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(res, res) {
  db.scrapedData.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.render("index", {
        found: found
       });
    }

})});

// Make a request call to grab the HTML body from the site of your choice
app.get("/scrape", function (req, res) {
  request("http://www.chicagotribune.com/sports/baseball/cubs/", function(error, response, html) {
  var $ = cheerio.load(html);
  $("section.trb_outfit_group_list_item_body").each(function(i, element) {

    var link = $(element).find("a").attr("href");
    var title = $(element).find("h3").text();
    var summary = $(element).find("p").text();
    if (title && summary && link) {
      db.scrapedData.insert({
      headline: title,
      summary: summary,
      link: "http://www.chicagotribune.com" + link
      })}}),
      function(err, found) {
        if (err) {
          // Log the error if one is encountered during the query
          console.log(err);
        }
        else {
          res.redirect("/");
        }}})});

      app.get('/delete/:_id', function(req, res){
        console.log(req.params.thisId)
        db.scrapedData.remove({'_id': req.params.thisId}),
        function(err, data) {
          if(err){
            console.log(err);
          } else {
            console.log("Comment deleted");
            res.redirect('/');
          }}});  
        
      
     

app.get("/drop", function(req, res) {
  // Remove a note using the objectID
  db.scrapedData.drop(function(error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        {
          res.render("index", removed);
      }
    }
  });
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
});