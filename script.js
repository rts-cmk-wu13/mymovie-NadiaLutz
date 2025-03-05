let accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OTZjNWNkNjcwYWJlZDUzMDVmMDgyOTg2ZTJlMjQ4ZSIsIm5iZiI6MTc0MDk4Njc5MS4xODMsInN1YiI6IjY3YzU1OWE3ODgxYzAxM2VkZTdhNmZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GC0q7C8tlc2UOU8SLns_FNXlBD6J1ZwLRs4DDdcFhU';
let baseUrl = 'https://image.tmdb.org/t/p/w500';
let genreMapping = {
  12: 'Adventure', 14: 'Fantasy', 16: 'Animation', 18: 'Drama', 27: 'Horror',
  28: 'Action', 35: 'Comedy', 36: 'History', 37: 'Western', 53: 'Thriller',
  80: 'Crime', 99: 'Documentary', 878: 'Science Fiction', 9648: 'Mystery',
  10402: 'Music', 10749: 'Romance', 10751: 'Family', 10752: 'War', 10770: 'TV Movie'
};

document.addEventListener('DOMContentLoaded', () => {
  let headerElm = document.createElement('header');
  headerElm.innerHTML = `
    <h1>MyMovies</h1>
    <label class="switch">
        <input type="checkbox" name="switch" id="switch">
        <span class="slider round"></span>
    </label>
  `;
  document.body.appendChild(headerElm);

  let currentOffset = 1;

  let mainElm = document.createElement('main');
  let movieListContainer = document.createElement('section');
  movieListContainer.innerHTML = `
    <div class="movielist__top">
      <h2>Now Showing</h2>
      <button id="seeMore" class="seemore__btn">See more</button>
    </div>
  `;
  let movieList = document.createElement('ul');
  movieList.classList.add('movielist');
  movieListContainer.appendChild(movieList);

  let popularListContainer = document.createElement('section');
  popularListContainer.innerHTML = `
    <div class="popularlist__top">
      <h2>Popular</h2>
      <button id="seemoreBtn" class="seemore__btn">See more</button>
    </div>
  `;
  let popularList = document.createElement('ul');
  popularList.classList.add('popularlist');
  popularListContainer.appendChild(popularList);

  mainElm.appendChild(movieListContainer);
  mainElm.appendChild(popularListContainer);
  document.body.appendChild(mainElm);

  let fetchMovielist = (page) => {
    let url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&api_key=${accessToken}`;
    let options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };
    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((json) => {
        if (json.results && json.results.length > 0) {
          let movieList = document.querySelector('.movielist');
          json.results.forEach((movie) => {
            let movieListItem = document.createElement('li');
            movieListItem.className = 'movielist__item';
            let posterPath = movie.poster_path;
            let imageUrl = posterPath ? `${baseUrl}${posterPath}` : '';
            movieListItem.innerHTML = `
              <a href="detail.html?id=${movie.id}">
                <img src="${imageUrl}" alt="${movie.title}" loading="lazy">
              </a>
              <h3>${movie.title}</h3>
              <div class="rating__details">
                <img src="img/star.png" class="star__img"> 
                <p>${movie.vote_average.toFixed(1)}/10 IMDb</p>
              </div>
            `;
            movieList.appendChild(movieListItem);
          });
        }
      })
      .catch((error) => {});
  };

  let fetchPopularlist = () => {
    let url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${accessToken}`;
    let options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    };
    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((json) => {
        if (json.results && json.results.length > 0) {
          let popularList = document.querySelector('.popularlist');
          json.results.forEach((movie) => {
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US&api_key=${accessToken}`, options)
              .then((res) => res.json())
              .then((movieDetails) => {
                let popularItem = document.createElement('li');
                popularItem.className = 'popular__item';
                let posterPath = movie.poster_path;
                let imageUrl = posterPath ? `${baseUrl}${posterPath}` : '';
                let genres = movie.genre_ids.map((genreId) => genreMapping[genreId] || 'Unknown Genre');
                let runtime = movieDetails.runtime
                  ? `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60} minutes`
                  : 'Runtime not available';

                popularItem.innerHTML = `
                  <div class="popular__item-left">
                    <a href="detail.html?id=${movie.id}">
                      <img src="${imageUrl}" class="popular__img" alt="${movie.title}" loading="lazy">
                    </a>
                  </div>
                  <div class="popular__item-right">
                    <h3>${movie.title}</h3>
                    <div class="rating__details">
                      <img src="img/star.png" class="star__img"> 
                      <p>${movie.vote_average.toFixed(1)}/10 IMDb</p>
                    </div>
                    <ul class="movie__genres">
                      ${genres.map((genre) => `<li class="genre__items">${genre}</li>`).join('')}
                    </ul>
                    <span><img src="img/clock.png"><p>${runtime}</p></span>
                  </div>
                `;
                popularList.appendChild(popularItem);
              });
          });
        }
      })
      .catch((error) => {});
  };

  let footerElm = document.createElement('footer');
  footerElm.innerHTML = `
  <ul>
    <li><img src="img/bookmark.png"></li>
    <li><img src="img/bookmarkcopy.png"></li>
    <li><img src="img/bookmarksave.png"></li>
</ul>`

document.body.appendChild(footerElm);

  fetchMovielist(currentOffset);
  fetchPopularlist();
});
