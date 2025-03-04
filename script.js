let apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OTZjNWNkNjcwYWJlZDUzMDVmMDgyOTg2ZTJlMjQ4ZSIsIm5iZiI6MTc0MDk4Njc5MS4xODMsInN1YiI6IjY3YzU1OWE3ODgxYzAxM2VkZTdhNmZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GC0q7C8tlc2UOU8SLns_FNXlBD6J1ZwLRs4DDdcFhU';
let baseUrl = 'https://image.tmdb.org/t/p/w500';
let options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
};

let genreMapping = {
  12: 'Adventure', 14: 'Fantasy', 16: 'Animation', 18: 'Drama', 27: 'Horror',
  28: 'Action', 35: 'Comedy', 36: 'History', 37: 'Western', 53: 'Thriller',
  80: 'Crime', 99: 'Documentary', 878: 'Science Fiction', 9648: 'Mystery',
  10402: 'Music', 10749: 'Romance', 10751: 'Family', 10752: 'War', 10770: 'TV Movie'
};

document.addEventListener('DOMContentLoaded', () => {
  let currentOffset = 1;

  function fetchMovielist(page) {
    let url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&api_key=${apiKey}`;

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        if (json.results && json.results.length > 0) {
          let movieList = document.querySelector('.movielist');
          if (!movieList) return;

          json.results.forEach(movie => {
            let movieItem = document.createElement('div');
            movieItem.className = 'movie__item';

            let posterPath = movie.poster_path;
            let imageUrl = posterPath ? `${baseUrl}${posterPath}` : '';

            movieItem.innerHTML = `
              <a href="detail.html?id=${movie.id}"> <img src="${imageUrl}" alt="${movie.title}" loading="lazy"></a>
              <h3>${movie.title}</h3>
              <div>
                <img src="img/star.png" class="star__img"> 
                <p>${movie.vote_average}/10</p>
              </div>
            `;        
            movieList.appendChild(movieItem);
          });
        }
      });
  }

  function fetchPopularlist() {
    let url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${apiKey}`;

    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        if (json.results && json.results.length > 0) {
          let popularList = document.querySelector('.popularlist');
          if (!popularList) return;

          json.results.forEach(movie => {
            let popularItem = document.createElement('div');
            popularItem.className = 'popular__item';

            let posterPath = movie.poster_path;
            let imageUrl = posterPath ? `${baseUrl}${posterPath}` : '';
            let genres = movie.genre_ids.map(genreId => genreMapping[genreId] || 'Unknown Genre').join(', ');

            popularItem.innerHTML = `
              <a href="detail.html?id=${movie.id}"> <img src="${imageUrl}" alt="${movie.title}" loading="lazy"></a>
              <h3>${movie.title}</h3>
              <div>
                <img src="img/star.png" class="star__img"> 
                <p>${movie.vote_average}/10</p>
              </div>
              <ul class="movie-genres">
                <li>${genres}</li>
              </ul>
            `;
            
            popularList.appendChild(popularItem);
          });
        }
      });
  }

  let observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        currentOffset += 1;
        fetchMovielist(currentOffset);
      }
    });
  }, {
    rootMargin: '200px',
  });

  let divElm = document.createElement("div");
  divElm.id = "root";

  divElm.innerHTML = `
    <main>
      <section class="movielist"></section>
      <section class="popularlist"></section>  
    </main>
    <footer></footer>
  `;
  document.body.appendChild(divElm);

  fetchMovielist(currentOffset);
  fetchPopularlist();  // Fetch the popular list on page load
});
