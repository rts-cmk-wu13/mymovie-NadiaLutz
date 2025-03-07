document.addEventListener('DOMContentLoaded', () => {
    currentOffset = 2

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
            return res.json();
          })
          .then((json) => {
            if (json.results && json.results.length > 0) {
              
                let movieListMore = document.querySelector('.movielist__more');
              json.results.forEach((movie) => {
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
            }
          })
      }
      fetchMovielist(currentOffset);
});
