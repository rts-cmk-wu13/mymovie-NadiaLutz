document.addEventListener('DOMContentLoaded', () => {
  // let headerDetails = document.createElement("header");
  // headerDetails.classList.add("header__details");
  // headerDetails.innerHTML = `
  //   <button class="return__btn">
  //     <a href="index.html">
  //       <img src="img/back.png">
  //     </a>
  //   </button>
  //   <label class="switch">
  //     <input type="checkbox" name="switch" id="switch">
  //     <span class="slider round"></span>
  //   </label>
  // `;

  // document.body.insertBefore(headerDetails, document.body.firstChild);

  let urlParams = new URLSearchParams(window.location.search);
  let movieId = urlParams.get('id'); 

  if (movieId) {
    fetchMovieDetails(movieId);
  }

  function fetchMovieDetails(movieId) {
    let movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${accessToken}`;
    let movieCreditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${accessToken}`;

    // Define options here (needed for your fetch calls)
    let options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // Use Promise.all to fetch both movie details and credits in parallel
    Promise.all([fetch(movieDetailsUrl, options), fetch(movieCreditsUrl, options)]).then(([movieRes, creditsRes]) => 
      Promise.all([movieRes.json(), creditsRes.json()])
    ).then(([movie, credits]) => {
      let detailSection = document.querySelector('.detail__section');
      if (!detailSection) return;

      detailSection.innerHTML = `
        <div class="movie__details">
          <div class="movie__details-top">
            <h1>${movie.title}</h1>
            <img src="img/bookmarksave.png">
          </div>
          <div class="rating__details details">
            <img src="img/star.png" class="star__img"> 
            <p>${movie.vote_average}/10 IMDb</p>
          </div>
          <ul class="movie__genres">
            ${movie.genres.map((genre) => `<li class="genre__items">${genre.name}</li>`).join('')}
          </ul>
          <div class="info__item-container">
            <li class="info__item"><span>Length</span> <p>${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min</p></li>
            <li class="info__item"><span>Language</span> <p>${movie.original_language}</p></li>
            <li class="info__item"><span>Rating</span> <p>${movie.rating}</p></li>
          </div>
          <h2>Description</h2>
          <p>${movie.overview}</p>
        </div>

        <section class="cast__section">
          <div class="cast__section-top">
            <h2>Cast</h2>
            <button id="seemoreBtn" class="seemore__btn">See more</button>
          </div>
          <ul class="cast__item-container">
            ${credits.cast && credits.cast.length ? credits.cast.map(actor => {
              return `<li class="cast__item">
                        <img src="${baseUrl}${actor.profile_path}" alt="${actor.name}" loading="lazy">
                        <p>${actor.name}</p>
                      </li>`;
            }).join('') : ''}
          </ul>
        </section>
      `;
    }).catch(error => console.error('Error fetching movie details or credits:', error));
  }
});
