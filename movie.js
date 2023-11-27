(function () {

  // Get the "title" element and set its content to the value stored in "movieName" key of localStorage
    const title = document.getElementById("movie-title");
    title.innerHTML = localStorage.getItem("movieName");

     // Get other DOM elements
    const movieYear = document.getElementById("movie-year");
    const movieRuntime = document.getElementById("movie-runtime");
    const movieRating = document.getElementById("movie-rating");
    const moviePoster = document.getElementById("movie-poster");
    const moviePlot = document.getElementById("movie-plot");
    const movieDirectorsName = document.getElementById("movie-director-names");
    const movieCastName = document.getElementById("movie-cast-names");
    const movieGenre = document.getElementById("movie-genre");
   // Call the function to fetch movie data using the movie title
    fetchMovies(title.innerHTML);
  
    async function fetchMovies(search) {
      const url = `https://www.omdbapi.com/?t=${search}&type=movie&apikey=28a2ff0`;
      try {
        const response = await fetch(url);
        const data = await response.json();


   // Update the webpage elements with the fetched movie data
        movieYear.innerHTML = data.Year;
        movieRuntime.innerHTML = data.Runtime;
        movieRating.innerHTML = `${data.imdbRating}/10`;
        moviePoster.setAttribute("src", `${data.Poster}`);
        moviePlot.innerHTML = data.Plot;
        movieDirectorsName.innerHTML = data.Director;
        movieCastName.innerHTML = data.Actors;
        movieGenre.innerHTML = data.Genre;
      } catch (err) {
         // Log any errors to the console
        console.log(err);
        alert(err);
      }
    }
  })();