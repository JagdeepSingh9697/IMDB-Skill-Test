//api
(function () {
  // Variable declarations for DOM elements
  const searchMovie = document.getElementById("search");
  const movieSuggestionsContainer = document.getElementById("card-container");
  const favMoviesContainer = document.getElementById("fav-movies-container");
  const emptyText = document.getElementById("empty-search-container");
  const favouritesSection = document.getElementById("favorites-section");
  const emptyFavText = document.getElementById("empty-fav-text");

  addToFavDOM();
  showEmptyText();
  let suggestionList = [];
  let favMovieArray = [];

  searchMovie.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  });

  // Event listner on search
  searchMovie.addEventListener("keyup", function () {
    let search = searchMovie.value;
    if (search === "") {
      emptyText.style.display = "block";
      movieSuggestionsContainer.innerHTML = "";
      suggestionList = [];
    } else {
      emptyText.style.display = "none";
      (async () => {
        let data = await fetchMovies(search);
        addToSuggestionContainerDOM(data);
      })();

      movieSuggestionsContainer.style.display = "grid";
    }
  });

  // Fetches movies data from the OMDB api and calls function to add it in
  async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?t=${search}&apikey=28a2ff0`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  // Shows in suggestion container DOM
  function addToSuggestionContainerDOM(data) {
    document.getElementById("empty-fav-text").style.display = "none";
    let isPresent = false;

    // to check if the movie is already present in the suggestionList array
    suggestionList.forEach((movie) => {
      if (movie.Title == data.Title) {
        isPresent = true;
      }
    });

    // If the movie is not present 
    if (!isPresent && data.Title != undefined) {
      if (data.Poster == "N/A") {
        data.Poster = "";
      }
      suggestionList.push(data);
      const movieCard = document.createElement("div");
      movieCard.setAttribute("class", "text-decoration");

      movieCard.innerHTML = `
        <div class="card my-2" data-id = " ${data.Title} ">
        <a href="movie.html" >
          <img
            src="${data.Poster} "
            class="card-img-top"
            alt="..."
            data-id = "${data.Title} "
          />
          <div class="card-body text-start">
            <h5 class="card-title" ><a href="movie.html" data-id = "${data.Title} "> ${data.Title}  </a></h5>
            <p class="card-text">
              <i class="fa-solid fa-star"><span id="rating">&nbsp;${data.imdbRating}</span></i>
              <button class="fav-btn"><i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i></button>
            </p>
          </div>
        </a>
      </div>
    `;
      movieSuggestionsContainer.prepend(movieCard);
    }
  }

   // Function to show/hide the empty favorite movies text
   function showEmptyText() {
    if (favMoviesContainer.innerHTML == "") {
      emptyFavText.style.display = "block";
    } else {
      emptyFavText.style.display = "none";
    }
  }

  // Add to favourite of localStorage
  async function handleFavBtn(e) {
    const target = e.target;

    let data = await fetchMovies(target.dataset.id);

    let favMoviesLocal = localStorage.getItem("favMoviesList");

    if (favMoviesLocal) {
      favMovieArray = Array.from(JSON.parse(favMoviesLocal));
    } else {
      localStorage.setItem("favMoviesList", JSON.stringify(data));
    }

    // to check if movie is already present in the fav list
    let isPresent = false;
    favMovieArray.forEach((movie) => {
      if (data.Title == movie.Title) {
        notify("already added to fav list");
        isPresent = true;
      }
    });

    if (!isPresent) {
      favMovieArray.push(data);
    }

    localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
    isPresent = !isPresent;
    addToFavDOM();
  }

  // Add to favourite list DOM
  function addToFavDOM() {
    favMoviesContainer.innerHTML = "";

    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    if (favList) {
      favList.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add(
          "fav-movie-card",
          "d-flex",
          "justify-content-between",
          "align-content-center",
          "my-2"
        );
        div.innerHTML = `
   
    <img src="${movie.Poster}" alt="" class="fav-movie-poster" />
    <div class="movie-card-details">
      <p class="movie-name mt-3 mb-0"><a href = "movie.html" class="fav-movie-name" data-id="${movie.Title}">${movie.Title}<a> </p>
      <small class="text-muted">${movie.Year}</small>
    </div>
    <div class="delete-btn my-4">
        <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
    </div>
    `;

        favMoviesContainer.prepend(div);
      });
    }
  }

   // Notifies the user with a pop-up alert
  function notify(text) {
    window.alert(text);
  }

  // Delete from favourite list
  function deleteFavouriteMovie(name) {
    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    let updatedList = Array.from(favList).filter((movie) => {
      return movie.Title != name;
    });

    localStorage.setItem("favMoviesList", JSON.stringify(updatedList));

    addToFavDOM();
    showEmptyText();
  }

 // Handles click events on the document
  async function handleClickListner(e) {
    const target = e.target;

    if (target.classList.contains("add-fav")) {
      e.preventDefault();
      handleFavBtn(e);
    } else if (target.classList.contains("fa-trash-can")) {
      deleteFavouriteMovie(target.dataset.id);
    } else if (target.classList.contains("fa-bars")) {
      if (favouritesSection.style.display == "flex") {
        document.getElementById("show-favourites").style.color = "#8b9595";
        favouritesSection.style.display = "none";
      } else {
        favouritesSection.classList.add("");
        document.getElementById("show-favourites").style.color =
          "var(--logo-color)";
        favouritesSection.style.display = "flex";
      }
    }

    localStorage.setItem("movieName", target.dataset.id);
  }

 // Event listener for click events on the document
  document.addEventListener("click", handleClickListner);
})();