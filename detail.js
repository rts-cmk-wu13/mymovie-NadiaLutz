let apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OTZjNWNkNjcwYWJlZDUzMDVmMDgyOTg2ZTJlMjQ4ZSIsIm5iZiI6MTc0MDk4Njc5MS4xODMsInN1YiI6IjY3YzU1OWE3ODgxYzAxM2VkZTdhNmZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GC0q7C8tlc2UOU8SLns_FNXlBD6J1ZwLRs4DDdcFhU';
let baseUrl = 'https://image.tmdb.org/t/p/w500';
let options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
};

document.addEventListener('DOMContentLoaded', () => {

  let urlParams = new URLSearchParams(window.location.search);
  let movieId = urlParams.get('id'); 

  if (movieId) {
    fetchMovieDetails(movieId);
  }
});

function fetchMovieDetails(movieId) {
  let movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&api_key=${apiKey}`;
  let movieCreditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;


  Promise.all([fetch(movieDetailsUrl, options), fetch(movieCreditsUrl, options)])
    .then(([movieRes, creditsRes]) => Promise.all([movieRes.json(), creditsRes.json()]))
    .then(([movie, credits]) => {
      let detailSection = document.querySelector('.detail__section');
      if (!detailSection) return;

  
      detailSection.innerHTML = `
        <div class="movie-details">
          <img src="${baseUrl}${movie.poster_path}" alt="${movie.title}" loading="lazy">
          <h2>${movie.title}</h2>
          <div>
               <img src="img/star.png" class="star__img"> 
               <p>${movie.vote_average}/10</p>
          </div>
          <p>${movie.genres.map(genre => genre.name).join(', ')}</p>
          <p>Description: ${movie.overview}</p>
          <p class="info__item">Length: ${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60} minutes</p>
          <p class="info__item">Language: ${movie.original_language}</p>
        </div>

        <section class="cast__section">
            <div class="cast__section-top">
                <h2>Cast</h2><button>See more</button>
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
}
