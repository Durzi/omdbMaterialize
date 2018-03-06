// Target Elements
var search  = document.querySelector(".input-field #search"),
    form    = document.querySelector("#submit"),
    goto    = document.querySelector("#goto"),
    determ  = document.querySelector(".determinate");


var row_count = 0;
var column_count = 1;

// Create row inside container class
function createRow() {
  let row = document.createElement("div");
  row.classList.add("row");
  row.setAttribute("id", "row-" + row_count);
  document.querySelector(".movie-cards").appendChild(row);
  row_count++;
}

// Return an array of each div with class row
function getRows() {
  let row = document.querySelectorAll(".movie-cards .row");
  return row;
}

// Return how many columns are in the last row
function getTotalColumns() {
  let column = document.querySelectorAll(".movie-cards .row:last-child .col").length;
  return column;
}


// Create Card and bring in OMDB data
function createCard(poster, title, imdbID) {

  let columnID = ".movie" + column_count;
  //Card
  let card = document.createElement("div");
  card.classList.add("card", "hoverable");
  document.querySelector(".movie-cards .row " + columnID).appendChild(card);

  //Card-image
  let card_image = document.createElement("div");
  card_image.classList.add("card-image");
  let img = document.createElement("img");
  img.classList.add("responsive-img");
  img.setAttribute("alt", "Movie poster: " + title);
  // If there is no image use default image not found
  if (poster == "N/A") {
    img.setAttribute("src", "img/notfound.png");
  } else {
    img.setAttribute("src", poster);
  }
  card_image.appendChild(img);
  document.querySelector(".movie-cards .row " + columnID + " .card").appendChild(card_image);

  //Card-title
  let card_title = document.createElement("p");
  card_title.classList.add("card-title", "flow-text");
  let movieTitle = document.createTextNode(title);
  card_title.appendChild(movieTitle);
  document.querySelector(".movie-cards .row " + columnID + " .card .card-image").appendChild(card_title);

  //Card-btn
  let btn = document.createElement("a");
  btn.classList.add("btn", "btn-floating", "red", "waves-effect", "halfway-fab", "modal-trigger", "hoverable");
  btn.setAttribute("href", "#modal1");
  btn.setAttribute("data-id", imdbID);
  btn.setAttribute("onClick", "movieDetails(this);");
  let icon = document.createElement("i");
  icon.classList.add("material-icons");
  let iconType = document.createTextNode("more_horiz");
  icon.appendChild(iconType);
  btn.appendChild(icon);
  document.querySelector(".movie-cards .row " + columnID + " .card .card-image").appendChild(btn);

}

// Add columns to row class and insert movie data
function createColumn(poster, title, imdbID) {
  let row, col, movie;
  movie = "movie" + column_count;

  // Create Column
  let column = document.createElement("div");
  column.classList.add("col", "s12", "m6", "l3", "scale-transition", "scale-out", movie);
  column.setAttribute("id", movie);

  if (row_count == 0 ){

    // Add Row to Container if no rows exists
    createRow();
    row = getRows();
    // Append column + card + card-image + img:poster + card-title:title + btn:imdbID
    row[row_count - 1].appendChild(column);
    createCard(poster, title, imdbID);

  } else {

    // Add Columns to current row
    // If there are 3 columns inside current row
    // Create new row and start adding columns to that row
    col = getTotalColumns();

    if ( col >= 4 ) {

      //Add row because there are 3 columns in current row
      createRow();
      row = getRows();
      row[row_count - 1].appendChild(column);
      createCard(poster, title, imdbID);

    } else {

      //Continue adding columns until columns >= 3
      row = getRows();
      row[row_count - 1].appendChild(column);
      createCard(poster, title, imdbID);

    }
  }
  column_count++;
}

function removeScaleOut(inc) {
 let x = document.querySelectorAll(".movie-cards .row .col");
 x[inc].classList.remove("scale-out");
}

// GET request to OMDb for search results
form.addEventListener('submit', function(e) {
  e.preventDefault();

  // if a search has already happened
  // remove all row's created
  // reset all counters
  //
  //Row > 0 means a search has taken place
  if (row_count > 0) {
    let x = document.querySelectorAll(".movie-cards .row");
    let eachRow = "row-";
    for (let i = 0; i < x.length; i++) {
      document.getElementById(eachRow + i).remove();
    }
   row_count = 0;
   column_count = 1;
  }


  let http = new XMLHttpRequest();

  http.onreadystatechange = function() {
    if (!http) {
      console.log("New XMLHttpRequest could not be made at this moment.");
    } else {
      //Bread and Butter
      try {
        // GET request
        if (this.readyState === 4 && this.status === 200) {
          var results = JSON.parse(this.response);
          console.log(results);
          // If results found createCard for each movie returned
          // Could pass each output as an argument and finish the createCard to populate each output
          //Output = Title, Director, Writers, Actors, IMDB Rating, Year, Rated, and plot
          let daCount = 0;
          for (let i = 0; i < results.Search.length; i++) {
            if (results.Search[i].Type == "movie" || results.Search[i].Type == "series") {
              createColumn(results.Search[i].Poster, results.Search[i].Title, results.Search[i].imdbID);

              setTimeout(function() {
            	  let x = removeScaleOut(daCount);
            	  daCount++;
            	}, 200 * i + 2);
            }
          }
        }
      } catch(e) {
        // Failed GET
        M.toast({html: results.Error, classes: 'deep-orange flow-text'});
      }
    }
  }
  http.open('GET', 'http://www.omdbapi.com/?apikey=95656712&s=' + search.value, true);
  http.send();
});


// Targets needed for modal1
const modalTitle    = document.querySelector(".modal .header"),
      modalPoster   = document.querySelector(".modal .card-image img"),
      modalDirector = document.querySelector(".modal .director"),
      modalProgress = document.querySelector(".modal .determinate"),
      modalRated    = document.querySelector(".modal .card-content .rated"),
      modalRuntime  = document.querySelector(".modal .card-content .runtime"),
      modalWriters  = document.querySelector(".modal .card-content .writers"),
      modalActors   = document.querySelector(".modal .card-content .actors"),
      modalGenre    = document.querySelector(".modal .card-content .genre"),
      modalPlot     = document.querySelector(".modal .card-content .plot"),
      modalSite     = document.querySelector(".modal .card-action #website")
      modalImdb     = document.querySelector(".modal .card-action #imdbsite");

function movieDetails(obj) {
  let id = obj.getAttribute("data-id");

  let http = new XMLHttpRequest();

  http.onreadystatechange = function() {
    if (!http) {
      console.log("This request just isn/'t going to happen.");
      return false;
    } else {
      try {
        if (this.readyState === 4) {
          if(this.status === 200) {
            const res = JSON.parse(this.response);
            console.log(res);

            // Set Title
            modalTitle.innerHTML = res.Title + " - " + res.Year;

            // Check if poster image exists
            // If not use placeholder not found image
            if (res.Poster == "N/A") {
              modalPoster.setAttribute("src", "img/notfound.png");
            } else {
              modalPoster.setAttribute("src", res.Poster);
            }

            // Set Director
            modalDirector.innerHTML = "Director: " + res.Director;

            // Convert IMDB rating into 100% progress bar
            let imdbRating = res.imdbRating * 10;
            modalProgress.style.width = imdbRating + "%";

            // Set Writers
            modalWriters.innerHTML = "Writer(s): " + res.Writer;

            // Set Actors
            modalActors.innerHTML = "Actors: " + res.Actors;

            // Set Genre
            modalGenre.innerHTML = "Genre: " + res.Genre;

            // Set Full Plot
            modalPlot.innerHTML = res.Plot;

            // Set Rated
            modalRated.innerHTML = res.Rated;

            // Set Runtime
            modalRuntime.innerHTML = res.Runtime;

            // Check if website is avaliable
            // If not use Materialize class to disable button
            if (res.Website == "N/A") {
              modalSite.classList.add("disabled");
            } else {
              modalSite.classList.remove("disabled");
              modalSite.setAttribute("href", res.Website);
            }

            // Set IMDB website link
            let imdbUrl = "http://www.imdb.com/title/" + res.imdbID + "/";
            modalImdb.setAttribute("href", imdbUrl);
          }
        }
      } catch(e) {
        console.log("Exception caught: " + e);
      }

    }
  }
  http.open("GET", 'http://www.omdbapi.com/?apikey=95656712&i=' + id + "&plot=full", true );
  http.send();
}







// Searches single titles
// form.addEventListener("submit", function(e) {
//   e.preventDefault();
//   var xhttp = new XMLHttpRequest();
//
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       let res = JSON.parse(this.response);
//       if (res.Response == "True") {
//
//         title.innerHTML = res.Title;
//
//         director.innerHTML = res.Director;
//         actors.innerHTML = res.Actors;
//         writers.innerHTML = res.Writer;
//
//         let percent = res.imdbRating * 10;
//         determ.style.width = percent + "%";
//
//         year.innerHTML = res.Year;
//         rated.innerHTML = res.Rated;
//
//
//         plot.innerHTML = res.Plot;
//         poster.setAttribute('src', res.Poster);
//
//
//         if (res.Website !== "N/A") {
//           goto.setAttribute('href', res.Website);
//           goto.classList.remove("disabled");
//         }
//         console.log(res);
//
//       } else {
//         title.innerHTML = "Movie not found";
//         content.innerHTML = "Plot not found";
//         poster.setAttribute('src', "img/placeholder.jpeg");
//         console.log(res);
//       }
//
//     }
//   };
//   xhttp.open("GET", "http://www.omdbapi.com/?apikey=95656712&t=" + search.value + "&plot=full", true);
//   xhttp.send();
// });
