document.addEventListener('DOMContentLoaded', () => {
  let currentOffset = 2;
  let accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OTZjNWNkNjcwYWJlZDUzMDVmMDgyOTg2ZTJlMjQ4ZSIsIm5iZiI6MTc0MDk4Njc5MS4xODMsInN1YiI6IjY3YzU1OWE3ODgxYzAxM2VkZTdhNmZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GC0q7C8tlc2UOU8SLns_FNXlBD6J1ZwLRs4DDdcFhU';
  let baseUrl = 'https://image.tmdb.org/t/p/w500';

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
      .then(response => response.json())
      .then(data => {
        let movieListMore = document.querySelector('.movielist__more');
        data.results.forEach((movie) => {
          let movieListItem = document.createElement('li');
          movieListItem.className = 'movielist__item-more';
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
          movieListMore.appendChild(movieListItem);
        });
      })
  };

  window.addEventListener('scroll', () => {
    let scrollHeight = document.documentElement.scrollHeight;
    let scrollPosition = window.innerHeight + window.scrollY;

    if (scrollPosition >= scrollHeight - 200) { 
      currentOffset++;
      if (currentOffset <= 1000) {
        fetchMovielist(currentOffset);
      } else {
        console.log("No more movies to fetch");
      }
    }
  });

  fetchMovielist(currentOffset);
});
