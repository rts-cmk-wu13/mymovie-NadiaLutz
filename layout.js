document.addEventListener('DOMContentLoaded', () => {
  let headerElm = document.createElement('header');

  headerElm.innerHTML = `
    <h1 class="index__headline">MyMovies</h1>
    <button class="return__btn">
      <a href="index.html">
        <img src="img/back.png" alt="Back">
      </a>
    </button>
    <button class="return__btn-more">
      <a href="index.html">
        <img src="img/back_grey.png" alt="Back" class="back__img-grey">
      </a>
    </button>
    <h1 class="headline__now">Now Showing</h1>
    <h1 class="headline__popular">Popular</h1>
    <label class="switch">
      <input type="checkbox" name="switch" id="switch">
      <span class="slider round"></span>
    </label>
  `;

document.body.insertBefore(headerElm, document.body.firstChild);

  let currentPage = document.location.pathname;

  if (currentPage.includes('index.html')) {
    document.querySelector('.index__headline').style.display = '';
    document.querySelector('.return__btn').style.display = 'none';
    document.querySelector('.return__btn-more').style.display = 'none';
    document.querySelector('.headline__now').style.display = 'none';
    document.querySelector('.headline__popular').style.display = 'none';
  }

  if (currentPage.includes('detail.html')) {
    headerElm.querySelector('.return__btn').style.display = 'block';
    headerElm.querySelector('.return__btn-more').style.display = 'none';
    headerElm.querySelector('.index__headline').style.display = 'none';
    headerElm.querySelector('.headline__now').style.display = 'none';
    headerElm.querySelector('.headline__popular').style.display = 'none';
  }

  if (currentPage.includes('showmore_now.html') || currentPage.includes('showmore_popular.html')) {
    headerElm.querySelector('.return__btn-more').style.display = 'block';
    headerElm.querySelector('.return__btn').style.display = 'none';
    headerElm.querySelector('.index__headline').style.display = 'none';
  }

  if (currentPage.includes('showmore_now.html')) {
    headerElm.querySelector('.headline__now').style.display = 'block';
    headerElm.querySelector('.headline__popular').style.display = 'none';
  }

  if (currentPage.includes('showmore_popular.html')) {
    headerElm.querySelector('.headline__now').style.display = 'none';
    headerElm.querySelector('.headline__popular').style.display = 'block';
  }

});


