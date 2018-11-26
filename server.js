var bodyParser = require("body-parser");
var express = require("express");
var cheerio = require("cheerio");
var request = require("request");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// var databaseUrl = 'mongodb://localhost:27017/myproject';
var databaseUrl = "mongodb://heroku_6zt1trbj:u6l3fot5u2bv764nrsm03nd6m2@ds123003.mlab.com:23003/heroku_6zt1trbj";
var collections = ["scrapedData", "comments"];
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
  // $("section.trb_outfit_group_list_item").each(function(i, element) {
  $("section.trb_outfit_group_list_item_body").each(function(i, element) {
    var link = $(element).find("a").attr("href");
    var title = $(element).find("h3").text();
    var summary = $(element).find("p").text();
    if (title && summary && link) {
        db.scrapedData.insert({
        headline: title,
        summary: summary,
        link: "http://www.chicagotribune.com" + link,
        }
      )}
    }),
    setTimeout(function(err, found) {
        if (err) {
          // Log the error if one is encountered during the query
          console.log(err);
        }
        else {
          res.redirect('/'), .1000};
})})});

      app.post('/delete', function(req, res){
        console.log(JSON.stringify(req.body.thisId));
        db.scrapedData.remove({"_id": db.ObjectId(req.body.thisId)},
        function(err, ) {
          if(err){
            console.log(err);
          } else {
            console.log("Article Deleted!");
          }
            // res.redirect("/");
        })}); 
        
        app.post("/comments", function(req, res){
          console.log("Chat ID: " + JSON.stringify(req.body.chatId));
          selectedId = ObjectId(JSON.stringify(req.body.chatId));
          db.scrapedData.aggregate([
            { $project: { _id: 1, headline: 1 } },
            { $match: { "_id": selectedId }},
            // { $addFields: { artId: { "$toString": "$_id" }}},
            { $lookup: {
              from: "comments",
              localField: "artId",
              foreignField: "articleId",
              as: "comments",
            }}], function(err, response) {
             if (err) {
                console.log(err);
             } else {
                console.log(response);
                res.send(response);
            }})});
            
            app.post("/updateComments", function(req, res){
              console.log("Chat ID: " + JSON.stringify(req.body.chatId));
              db.scrapedData.aggregate([
                { $project: { _id: 1, headline: 1 } },
                { $match: { _id: db.ObjectId(req.body.chatId) } },
                { $addFields: { artId: { "$toString": "$_id" }}},
                { $lookup: {
                  from: "comments",
                  localField: "artId",
                  foreignField: "articleId",
                  as: "comments",
                }}], function(err, response) {
                 if (err) {
                    console.log(err);
                 } else {
                    console.log(response);
                    res.send(response);
                }})});

          app.post("/post", function(req, res) {
            let { body } = req;
            db.comments.insert({
              articleId: body.articleId,
              name: body.name,
              message: body.message
            }),function(err, response) {
              if(err) {
                console.log(err); 
              } else {
                console.log(response);
                res.send(response);
              }
            }}); 
     

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

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// app.listen(3000, function() {
//   console.log("App running on port 3000!");
// });