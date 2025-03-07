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

    let options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };

    Promise.all([fetch(movieDetailsUrl, options), fetch(movieCreditsUrl, options), fetch(movieTrailerUrl, options)])
      .then(([movieRes, creditsRes, trailerRes]) => 
        Promise.all([movieRes.json(), creditsRes.json(), trailerRes.json()])
      )
      .then(([movie, credits, trailerData]) => {
        let detailSection = document.querySelector('.detail__section');
        if (!detailSection) return;

     
        let trailer = trailerData.results.find((video) => video.type === 'Trailer');
        let videoUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';

   
        detailSection.innerHTML = `
          <div class="movie__details">
       
            ${videoUrl ? `<iframe width="100%" height="300px" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : ''}
            
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
      })
      .catch(error => console.error('Error fetching movie details or credits:', error));
  }
});
