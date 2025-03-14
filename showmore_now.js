document.addEventListener('DOMContentLoaded', () => {
  let currentOffset = 1;
  let accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OTZjNWNkNjcwYWJlZDUzMDVmMDgyOTg2ZTJlMjQ4ZSIsIm5iZiI6MTc0MDk4Njc5MS4xODMsInN1YiI6IjY3YzU1OWE3ODgxYzAxM2VkZTdhNmZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GC0q7C8tlc2UOU8SLns_FNXlBD6J1ZwLRs4DDdcFhU';
  let baseUrl = 'https://image.tmdb.org/t/p/w500';

  function searchMovie() {
    let searchInput = document.getElementById("searchbar").value.toLowerCase();
   
    let movieListItems = document.querySelectorAll(".showmore__now-item"); 
    
    movieListItems.forEach(item => {
      let movieTitle = item.querySelector("h3").textContent.toLowerCase();
      if (movieTitle.includes(searchInput)) {
        item.style.display = "block"; 
      } else {
        item.style.display = "none"; 
      }
    });
  }

  let observer = new IntersectionObserver(function(entries) { 
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        currentOffset++;
        fetchMovielist(currentOffset);
      }
    });
  }, {
    rootMargin: '100px',
  });

  function fetchMovielist(page) {
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
        let movieListMore = document.querySelector('.showmore__now');
        data.results.forEach((movie) => {
          let movieListItem = document.createElement('li');
          movieListItem.className = 'showmore__now-item';
          let posterPath = movie.poster_path;
          let imageUrl = posterPath ? `${baseUrl}${posterPath}` : 'img/placeholder.png';
          movieListItem.innerHTML = `
            <a href="detail.html?id=${movie.id}">
              <img src="${imageUrl}" alt="${movie.title}" onerror="imageError()" loading="lazy">
            </a>
            <h3>${movie.title}</h3>
            <div class="rating__details">
              <img src="img/star.png" class="star__img"> 
              <p>${movie.vote_average.toFixed(1)}/10 IMDb</p>
            </div>
          `;

          movieListMore.appendChild(movieListItem);
        }); 
        
        let lastMovieItem = document.querySelector(".showmore__now-item:last-child");
        observer.observe(lastMovieItem);
      })
  }

  let searchContainer = document.createElement('div');
  searchContainer.className = 'search__container';
  searchContainer.innerHTML = `
    <input class="search" id="searchbar" type="text" name="name" placeholder="Search">
  `;

  let movieListMore = document.querySelector('.showmore__now');
  if (movieListMore) {
    movieListMore.insertAdjacentElement('beforebegin', searchContainer);
  }

  document.getElementById("searchbar").addEventListener('keyup', searchMovie);

  fetchMovielist(currentOffset);
});
