const movieList = document.querySelector('.movie__list');
const searchInput = document.querySelector('.header__search input');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal__info');
const closeModalBtn = document.querySelector('.close');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjQ2NTM3MzZmNzAxMDRlYzAyYWMwOGY2ZmE2ZjhkZSIsInN1YiI6IjYzOTNiNzYxZjA0ZDAxMDA4YzQyNDlhNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X3-lC250bFHowS0Mm1dk8NwooCSrDdDebR6FG4HfgQc',
  },
};

const fetchApi = async data => {
  return await fetch(data, options)
    .then(res => res.json())
    .then(response => response)
    .catch(err => console.error(err));
};

const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const getGenres = async () => {
  const genre = await fetchApi(
    'https://api.themoviedb.org/3/genre/movie/list?language=en'
  );
  const { genres } = genre;
  return genres;
};

const createSingleCardMovie = (
  id,
  poster_path,
  original_title,
  vote_average,
  release_date,
  movieGenres
) => {
  return `
    <li class="movie__item" data-id=${id}>
    <div class="movie__item_img">
    <img src="${
      poster_path
        ? `https://image.tmdb.org/t/p/original${poster_path}`
        : '../img/not_img.jpg'
    }" loading="lazy"/>
    </div>
    <p class="movie__item_title">${original_title}</p>
    <span class="movie__item_rating">${vote_average.toFixed(1)}</span>
    <span class="movie__item_genre">${
      movieGenres ? movieGenres.join(', ') : ''
    } ${isNaN(release_date) ? new Date(release_date).getFullYear() : ''} </span>
    </li>
    `;
};

const searchMovie = async query => {
  const searchFilm = await fetchApi(
    `https://api.themoviedb.org/3/search/movie?query=${query}`
  );
  const { results } = searchFilm;
  const genres = await getGenres();

  const searchRes = results.map(res => {
    const {
      poster_path,
      original_title,
      vote_average,
      release_date,
      genre_ids,
      id,
    } = res;

    const movieGenres = genre_ids.map(id => {
      const genre = genres.find(g => g.id === id);
      return genre ? genre.name : '';
    });

    return createSingleCardMovie(
      id,
      poster_path,
      original_title,
      vote_average,
      release_date,
      movieGenres
    );
  });

  movieList.innerHTML = searchRes;
  document
    .querySelectorAll('.movie__item')
    .forEach(el =>
      el.addEventListener('click', () => openModal(el.dataset.id))
    );
};

searchInput.addEventListener(
  'input',
  debounce(e => {
    let inp = e.target.value;
    !inp ? createListMovie() : searchMovie(inp);
  }, 500)
);

const openModal = async id => {
  const idEl = await fetchApi(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`
  );
  const { backdrop_path, original_title, overview } = idEl;
  overlay.classList.add('open-modal');
  modal.innerHTML = `
  <img src="https://image.tmdb.org/t/p/original${backdrop_path}"/>
  <p class="movie__title">${original_title}</p>
  <p>${overview}</p>
  `;
};

const closeModal = () => {
  overlay.classList.remove('open-modal');
};

const createListMovie = async () => {
  const dataMovie = await fetchApi(
    `https://api.themoviedb.org/3/trending/movie/week?language=en-US`
  );
  const { results } = dataMovie;
  const genres = await getGenres();
  const resFilm = results
    .map(film => {
      const {
        poster_path,
        original_title,
        vote_average,
        genre_ids,
        release_date,
        id,
      } = film;

      const movieGenres = genre_ids.map(id => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : '';
      });

      return createSingleCardMovie(
        id,
        poster_path,
        original_title,
        vote_average,
        release_date,
        movieGenres
      );
    })
    .join('');
  movieList.innerHTML = resFilm;

  document
    .querySelectorAll('.movie__item')
    .forEach(el =>
      el.addEventListener('click', () => openModal(el.dataset.id))
    );
};

closeModalBtn.addEventListener('click', () => closeModal());
overlay.addEventListener('click', e => {
  e.target === e.currentTarget ? closeModal() : null;
});
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
createListMovie();
