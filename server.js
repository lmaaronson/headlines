var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
const Article = require("./models/article.js");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");


// -----------------DB configuration with mongoose--------
// ----------------- define local mongoose db-------------
var databaseUri = "mongodb://localhost/headlines";
//  ----------------end of local db definition

if(process.env.MONGODB_URI) {
//this exectues if this is being executed in your heroku app
mongoose.connect(process.env.MONGODB_URI);

} else {
  //  this executes if this is being executed locally
  mongoose.connect(databaseUri)
}

var db=mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error:', err);
});

db.once('open', function() {
  console.log('Mongoose connect success.');
});
//------------------------end DB configuration-----------------

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/headlines");


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


//-------------------------------------------
// Routes
// A GET route for scraping the  website
app.get("/scrape", function (req, res) {
  request("https://medium.freecodecamp.org/", function (error, response, html){
  var $ = cheerio.load(html);


// HERE THE SCRAPE HAPPENS
// using inspect find a class or id that appears in what you want to 
// scrape and put that into the .each function
// then define what you are scraping
// console.log('loaded html');
  $(".postArticle").each(function(i, elements) {
    var link = $(this).children().children('a').attr('href');
    //console.log('link', link);

    var title = $(this).children().find('h3').text();
    //console.log('title', title);

    if (title && link) {
      // check if the article aready exists
      db.Article.count({link: link}, function (err, count) {
        //console.log("count", count);
        if (count > 0) {
          //console.log("article already exists!");
        } else {
          //console.log("creating a new article");
          db.Article.create({
            title: title,
            link: link,
            saved: false,
            // saved: false is not needed since its default
          },
          function(err, inserted) {
            if (err) {
              console.log(err);
            }
            else {
              //console.log("inserted");
            }
          }); 
        }
      }); 


      
    }
  });
});
  res.send("Scrape Complete")
});
//-----------------------------------------------


// AFTER THE SCRAPE THE SERVER CB FOR THE ARTICLES IN THE DB
// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // /articles?saved=true
  console.log("req.query", req.query);
  if (req.query.saved === 'true') {
    // Grab every document in the Articles collection
    db.Article.find({ saved: true })
     .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
   .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  } else {
   // Grab every document in the Articles collection
    db.Article.find({ saved: false})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  }



});

// --------------------------------------------------------------
app.get("/", function(req, res) {   // grab all articles in the collection where saved = true

  db.Article.find({saved: true})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    
    .catch(function(err) {    // if an error occured, send it to the client
      res.json(err);
    });
  
  });

  // Route for saved or not saved articles  
// we are in the server so we can talk to the route
app.post("/articles/:id", function (req, res) {
  console.log(req.params.id);

  // id req.params.id is the conditions           function (err, article) is the callback   
  Article.findOneAndUpdate({"_id": req.params.id}, 
  {$set:{saved: true}}, function(err, res) {
// // Save an article
// app.post("/articles/save/:id", function(req, res) {
//   // Use the article id to find and update its saved boolean
//   Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
//   // Execute the above query
//   .exec(function(err, doc) {
//     // Log any errors
//     if (err) {
//       console.log(err);
//     }
//     else {
//       // Or send the document to the browser
//       res.send(doc);
//     }
//   });
// });

  });
})

