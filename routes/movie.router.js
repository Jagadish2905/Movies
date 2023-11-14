const express = require('express');
const Movie = require('../controllers/movie.controller');
const verifyUser = require("../middleware/authentication")
const fileUpload = require("../middleware/upload")
const router = express.Router();


router.get('/movies',verifyUser,Movie.getMovies);


router.get('/search',verifyUser,Movie.searchMovie);

router.post('/movies', fileUpload.single('streamingLink'),verifyUser,Movie.createMovie);

router.put('/movies/:id', fileUpload.single('streamingLink'),verifyUser,Movie.updateMovie);

router.delete('/movies/:id',verifyUser,Movie.deleteMovie);

module.exports =  router;
