document.addEventListener('DOMContentLoaded', () => {
  let urlParams = new URLSearchParams(window.location.search);
  let movieId = urlParams.get('id'); 

  if (movieId) {
    fetchMovieDetails(movieId);
  }

  function fetchMovieDetails(movieId) {
    let movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${accessToken}`;
    let movieCreditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${accessToken}`;
    let movieTrailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${accessToken}`;
    let movieContentRatingsUrl = `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${accessToken}`;

    let options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    Promise.all([
      fetch(movieDetailsUrl, options), 
      fetch(movieCreditsUrl, options), 
      fetch(movieTrailerUrl, options),
      fetch(movieContentRatingsUrl, options)
    ])
    .then(([movieRes, creditsRes, trailerRes, ratingsRes]) => 
      Promise.all([movieRes.json(), creditsRes.json(), trailerRes.json(), ratingsRes.json()])
    )
    .then(([movie, credits, trailerData, ratingsData]) => {

      let trailer = trailerData.results.find((video) => video.type === 'Trailer');
      let videoUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';

      let videoSection = document.createElement('section');
      videoSection.classList.add("video__section");
      videoSection.innerHTML = `
        ${videoUrl ? `<iframe class="video" width="100%" height="350px" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : ''}
        `;
      document.body.append(videoSection);
      let contentRating = getRating(ratingsData);

      let detailSection = document.querySelector('.detail__section');
      if (!detailSection) return;  

      detailSection.innerHTML = `
        <div class="movie__details">
          <div class="movie__details-top">
            <div class="movie__details-top-left">
            <h1>${movie.title}</h1>
            <p>${getFullYear(movie.release_date)}</p>
            </div>
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
            <li class="info__item"><span>Rating</span> <p>${contentRating}</p></li>
          </div>
          <h2>Description</h2>
          <p>${movie.overview}</p>
        </div>

        <section class="cast__section">
          <div class="cast__section-top">
            <h2>Cast</h2>
            <button id="seemoreBtn" class="seemore__btn"><a>See more</a></button>
          </div>
          <ul class="cast__item-container">
            ${credits.cast && credits.cast.length ? credits.cast.map(actor => {
              return `<li class="cast__item">
                        <img src="${baseUrl}${actor.profile_path}" alt="${actor.name}" loading="lazy">
                        <p>${actor.name}</p>
                      </li>
                      `;
            }).join('') : ''}
          </ul>
        </section>
      `;
    });
  }

  function getRating(ratingsData) {

    let usRating = ratingsData.results.find(rating => rating.iso_3166_1 === 'US');
    if (usRating && usRating.release_dates.length) {
      let rating = usRating.release_dates[0].certification;
      return rating || 'Not Rated';
    }
    return 'Not Rated';
  }

 
  function getFullYear(releaseDate) {

    let releaseDateObj = new Date(releaseDate);
    return releaseDateObj.getFullYear(); 
  }
});
