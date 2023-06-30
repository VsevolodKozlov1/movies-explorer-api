const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => Movie.find({})
  .then((movies) => {
    const refinedMovies = movies.map((movie) => ({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailerLink: movie.trailerLink,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
    }));
    res.send(refinedMovies);
  })
  .catch(next);

module.exports.addMovie = (req, res, next) => Movie.create({
  country: req.body.country,
  director: req.body.director,
  duration: req.body.duration,
  year: req.body.year,
  description: req.body.description,
  image: req.body.image,
  trailerLink: req.body.trailerLink,
  thumbnail: req.body.thumbnail,
  movieId: req.body.movieId,
  nameRU: req.body.nameRU,
  nameEN: req.body.nameEN,
  owner: req.user._id,
})
  .then((movie) => res.status(201).send(movie))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные при добавлении фильма!'));
    } else {
      next(err);
    }
  });

module.exports.deleteMovieById = (req, res, next) => Movie.findById(req.params.movieId)
  .then((movie) => {
    if (!movie) throw new NotFoundError('Фильм не найден');
    if (movie.owner.toString() !== req.user._id) throw new ForbiddenError('Невозможно удалить чужой фильм');
    movie.deleteOne()
      .then(() => res.send(movie))
      .catch(next);
  })
  .catch(next);
