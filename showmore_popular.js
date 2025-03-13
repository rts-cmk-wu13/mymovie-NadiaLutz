
document.addEventListener('DOMContentLoaded', () => {
  let currentOffset = 1;
  let accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OTZjNWNkNjcwYWJlZDUzMDVmMDgyOTg2ZTJlMjQ4ZSIsIm5iZiI6MTc0MDk4Njc5MS4xODMsInN1YiI6IjY3YzU1OWE3ODgxYzAxM2VkZTdhNmZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GC0q7C8tlc2UOU8SLns_FNXlBD6J1ZwLRs4DDdcFhU';
  let baseUrl = 'https://image.tmdb.org/t/p/w500';

let searchMovie = () => {
  let searchInput = document.getElementById("searchbarPop").value.toLowerCase(); 
  let movieListItems = document.querySelectorAll(".showmore__popular-item");
  console.log(searchInput);
  

  movieListItems.forEach(item => {
    let movieTitle = item.querySelector("h3").textContent.toLowerCase();
    if (movieTitle.includes(searchInput)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
};

  let observer = new IntersectionObserver(function(entries) { 
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        currentOffset++;
        fetchPopularListMore(currentOffset);
      }
    });
  }, {
    rootMargin: '100px',
  });

  let fetchPopularListMore = (page) => {
    let url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=${accessToken}`;
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
        let popularListMore = document.querySelector('.showmore__popular');
        data.results.forEach((movie) => {
          let popularListItem = document.createElement('li');
          popularListItem.className = 'showmore__popular-item';
          let posterPath = movie.poster_path;
          let imageUrl = posterPath ? `${baseUrl}${posterPath}` : '';
          popularListItem.innerHTML = `
            <a href="detail.html?id=${movie.id}">
              <img src="${imageUrl}" alt="${movie.title}" loading="lazy">
            </a>
            <h3>${movie.title}</h3>
            <div class="rating__details">
              <img src="img/star.png" class="star__img"> 
              <p>${movie.vote_average.toFixed(1)}/10 IMDb</p>
            </div>
          `;
          popularListMore.appendChild(popularListItem);
        });

        let lastPopularItem = document.querySelector(".showmore__popular-item:last-child");
        if (lastPopularItem) {
          observer.observe(lastPopularItem);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  let searchContainer = document.createElement('div');
  searchContainer.innerHTML = `
    <input class="search" id="searchbarPop" type="text" name="name" placeholder="Search">
  `;

  let popularListMore = document.querySelector('.showmore__popular');
  if (popularListMore) {
    popularListMore.insertAdjacentElement('beforebegin', searchContainer);
  }

  document.getElementById("searchbarPop").addEventListener('keyup', searchMovie); 


  fetchPopularListMore(currentOffset);
});
