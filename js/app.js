const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjQ2NTM3MzZmNzAxMDRlYzAyYWMwOGY2ZmE2ZjhkZSIsInN1YiI6IjYzOTNiNzYxZjA0ZDAxMDA4YzQyNDlhNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X3-lC250bFHowS0Mm1dk8NwooCSrDdDebR6FG4HfgQc',
  },
};

const movieList = document.querySelector('.movie__list');

const fetchApi = async data => {
  return await fetch(data, options)
    .then(res => res.json())
    .then(response => response)
    .catch(err => console.error(err));
};

const getGenres = async () => {
  const genre = await fetchApi(
    'https://api.themoviedb.org/3/genre/movie/list?language=en'
  );
  const { genres } = genre;
  return genres;
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
      } = film;

      const movieGenres = genre_ids.map(id => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : '';
      });

      return `
    <li class="movie__item">
    <div class="movie__item_img">
    <img src="https://image.tmdb.org/t/p/original${poster_path}" loading="lazy"/>
    </div>
    <p class="movie__item_title">${original_title}</p>
    <span class="movie__item_rating">${vote_average.toFixed(1)}</span>
    <span class="movie__item_genre">${movieGenres.join(', ')} | ${new Date(
        release_date
      ).getFullYear()} </span>
    </li>
    `;
    })
    .join('');
  movieList.innerHTML = resFilm;
};

createListMovie();
