document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OTZjNWNkNjcwYWJlZDUzMDVmMDgyOTg2ZTJlMjQ4ZSIsIm5iZiI6MTc0MDk4Njc5MS4xODMsInN1YiI6IjY3YzU1OWE3ODgxYzAxM2VkZTdhNmZiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GC0q7C8tlc2UOU8SLns_FNXlBD6J1ZwLRs4DDdcFhU';
    let movieUrl = 'https://api.themoviedb.org/3/movie/{movie_id}?language=en-US'; 
    let options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}` 
      }
    };
  
    let sectionElm = document.createElement("section");
    sectionElm.className = "movielist"; 
    document.body.appendChild(sectionElm);
  
    let currentOffset = 1; 
    let baseUrl = 'https://image.tmdb.org/t/p/w500'; 
  
    function fetchMovielist(page) {
      const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&api_key=${apiKey}`;
  
      fetch(url, options)
        .then(res => res.json())
        .then(json => {
          if (json.results && json.results.length > 0) {
            const movieList = document.querySelector('.movielist');
  
            json.results.forEach(movie => {
              const movieItem = document.createElement('div');
              movieItem.className = 'movie__item';
  
              const posterPath = movie.poster_path;
              const imageUrl = posterPath ? `${baseUrl}${posterPath}` : ''; 
  
              movieItem.innerHTML = `
                <h3>${movie.title}</h3>
                <p>${movie.overview}</p>
                <img src="${imageUrl}" alt="${movie.title}" loading="lazy">
              `;
              movieList.appendChild(movieItem);
            });
          }
        })
        .catch(err => {
          console.error('Error fetching movie data:', err);
        });
    }
  
    let observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          currentOffset += 1;
          if (currentOffset < 100) {
            fetchMovielist(currentOffset);
          }
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
      </main>
      <footer></footer>
    `;
  
    document.body.innerHTML = `
      <header>
        <h1>My Movies</h1>
        <label class="switch">
          <input type="checkbox" name="switch" id="switch">
          <span class="slider round"></span>
        </label>
      </header>
    ` + document.body.innerHTML; 
  
    document.body.appendChild(divElm); 
  
    fetchMovielist(currentOffset);
  });
  