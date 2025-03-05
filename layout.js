
document.addEventListener('DOMContentLoaded', () => {
    let headerElm = document.createElement('header');
  
    headerElm.innerHTML = `
      <h1 class="index__headline">MyMovies</h1>
      <button class="return__btn">
        <a href="index.html">
          <img src="img/back.png" alt="Back">
        </a>
      </button>
      <label class="switch">
        <input type="checkbox" name="switch" id="switch">
        <span class="slider round"></span>
      </label>
    `;
    
    document.body.insertBefore(headerElm, document.body.firstChild);
  
    let currentPage = document.location.pathname;
  
    if (currentPage.includes('detail.html')) {
      headerElm.querySelector('.return__btn').style.display = 'block';
      headerElm.querySelector('.index__headline').style.display = 'none';
    } 
    else {
  headerElm.querySelector('.return__btn').style.display = 'none';
  headerElm.querySelector('.index__headline').style.display = 'block';
    }
  });
  