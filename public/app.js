//  scrape articles as document loads
$(document).on("click", "#scrape", function() {
  console.log ("button clicked")



  // Now make an ajax call for the scrape of articles
  $.ajax({
    method: "GET",
    url: "/scrape" 
  })
    .then(function(result) {
      // location.reload()
      console.log('result', result);
    });
  });


// WHAT IF WE STUCK 22-32 ON LINE 13 SO IT WOULD FIRE OFF ONLY AFTER THE SCRAPE
// BUTTON IS CLICKED?!?!?!!
// Grab the articles as a json files to be displayed in the <div> on index.html
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(`
      <p data-id="${data[i]._id}">
        <a href="${data[i].link}" target="_blank">${data[i].title}</a>
        <button class="save-article">Save Article</button></p>`
      );
  }
});

// TODO:
// To display the saved articles:
// Maybe you could add a "View Saved Articles" button next to the 
//  "Scrape" button? That'd be easier, and probably a better UI
//  since users could save multiple articles before getting redirected
//  to a view of all the saved articles.

// Query the database to receive all articles where "saved": true
// Send the resulting data to a new route. Maybe something like:
//   $.getJSON("/savedarticles", function(data) {})
// Inside the new route, clear out the $("#articles") div.
// Use a loop like you have up there on line 23 to HTML-ify and append
//  to $("#articles") all of the saved articles.



// When you click the save article button
$(document).on("click", ".save-article", function() {
   // console.log($(this))
  // console.log($(this).parent().children('a').attr('href'))
  // console.log($(this).parent().children('a').text())
  // const title = $(this).parent().children('a').text()
  // const link = $(this).parent().children('a').attr('href')
  // update this thing in my db with data-id to saved === true
  // console.log($(this).parent().attr('data-id'))
  
  const savedID = $(this).parent().attr('data-id')

  $.ajax({
    method: "PUT",
    url: "/articles/" + savedID,
  })

  // Grab the id associated with the article from the submit button
  // var thisId = $(this).attr("data");
});



//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });