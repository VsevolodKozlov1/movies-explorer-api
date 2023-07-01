const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegExp = require('../utils/regexp');
const {
  getMovies,
  addMovie,
  deleteMovieById,
} = require('../controllers/movie');

movieRouter.get('/movies', getMovies);

movieRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(urlRegExp),
      trailerLink: Joi.string().required().pattern(urlRegExp),
      thumbnail: Joi.string().required().pattern(urlRegExp),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  addMovie,
);

movieRouter.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovieById,
);

module.exports = movieRouter;
