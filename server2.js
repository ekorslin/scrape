// Using this template, the cheerio documentation,
// and what you've learned in class so far, scrape a website
// of your choice, save information from the page in a result array, and log it to the console.
var express = require("express");
var cheerio = require("cheerio");
var request = require("request");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var databaseUrl = "scraper";
var collections = ["scrapedData"]
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.send("Hello world");
});

app.get("/all", function(res, res) {
  db.scrapedData.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
    res.render("index", found);
})});

// Make a request call to grab the HTML body from the site of your choice
app.get("/scrape", function (req, res) {
  request("http://www.chicagotribune.com/sports/baseball/cubs/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  // var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("section.trb_outfit_group_list_item_body").each(function(i, element) {

    var link = $(element).find("a").attr("href");
    var title = $(element).find("h3").text();
    var summary = $(element).find("p").text();
    // console.log(title);
    // console.log(link);

    // Save these results in an object that we'll push into the results array we defined earlier
    // results.push({
    if (title && summary && link) {
      db.scrapedData.insert({
      headline: title,
      summary: summary,
      link: "http://www.chicagotribune.com/sports/baseball/cubs" + link
      },
      function(err, inserted) {
        if (err) {
          // Log the error if one is encountered during the query
          console.log(err);
        }
        else {
          // Otherwise, log the inserted data
          console.log(inserted);
        }
      });
    }
  });
// Send a "Scrape Complete" message to the browser
res.send("Scrape Complete Mother Fucker!");
});})

app.listen(3000, function() {
  console.log("App running on port 3000!");
});