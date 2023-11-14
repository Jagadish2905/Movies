const Movie = require('../models/movies.model');
const constants = require("../utilities/constants");
const fs = require('fs')
const mongoose = require('mongoose');

exports.getMovies = async(req, res) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1;
    const movie = await Movie.find().skip((pageNumber - 1) * pageSize)
      .limit(pageSize).sort({ _id: -1 });
    const total = await Movie.countDocuments();
    res.status(constants.post_success).send({
      data: { movie: movie, total: total },
      error: null,
      status: constants.post_success,
      message: 'All the movies Collected Sucessfully'
    })
  } catch (error) {
    res.status(constants.error).send({
      data: null,
      error: error,
      status: constants.error,
      message: 'Error in getting the movies'
    })
  }
  }

  exports.searchMovie =  async (req, res) => {
    const query = req.query.data;
    try {
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1;
      const movies = await Movie.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { genre: { $regex: query, $options: 'i' } },
        ],
      }).skip((pageNumber - 1) * pageSize)
      .limit(pageSize).sort({ _id: -1 });
      res.status(constants.post_success).send({
        data: { movies: movies },
        error: null,
        status: constants.post_success,
        message: 'Got the Movies Sucessfully'
      })
    } catch (error) {
      res.status(constants.error).send({
        data: null,
        error: error,
        status: constants.error,
        message: 'Error in getting the Movies'
      })
    }
  }

  exports.createMovie = async (req, res) => {
    try{
      console.log(req.role,'data role')
      if(req.role == 'Admin' ){
      const createmovie = req.body
      if(req.file){
        createmovie.streamingLink = req.file.path
      }
    const movieCreated = await Movie.create(createmovie)
    res.status(constants.post_success).send({
      data: { movie: movieCreated },
      error: null,
      status: constants.post_success,
      message: 'Movie created Sucessfully'
    })
  }else{
    res.status(constants.error).send({
      status: constants.error,
      message: 'Permission Denied'
    })
  }
  }
  catch (error) {
    res.status(constants.error).send({
      data: null,
      error: error,
      status: constants.error,
      message: 'Error in creating the Movie'
    })
  }
  }

  exports.updateMovie = async (req, res) => {
    try{
      console.log(req.params.id,'data id')
      if(req.role == 'Admin' ){
      const updatemovie = req.body
      if(req.file){
        updatemovie.streamingLink = req.file.path
      }
      const movieId = req.params.id && mongoose.isValidObjectId(req.params.id) ? req.params.id : mongoose.Types.ObjectId();
      console.log(movieId,'movie id')
    const movieCreated = await Movie.findOneAndUpdate({ _id: movieId }, updatemovie, { new: true})
    res.status(constants.post_success).send({
      data: { movie: movieCreated },
      error: null,
      status: constants.post_success,
      message: 'Movie updated Sucessfully'
    })
  }else{
    res.status(constants.error).send({
      status: constants.error,
      message: 'Permission Denied'
    })
  }
  }
  catch (error) {
    res.status(constants.error).send({
      data: null,
      error: error,
      status: constants.error,
      message: 'Error in updating the Movie'
    })
  }
  }

  exports.deleteMovie = async (req, res) => {
    try {
      if(req.role == 'Admin' ){
      const deleteMovie = await Movie.findOneAndDelete({_id: req.params.id})
      console.log(deleteMovie,'delete movie')
      fs.unlink(deleteMovie.streamingLink, (err) => {
        if (err) throw err;
      })
      res.status(constants.post_success).send({
        data: deleteMovie,
        error: null,
        status: constants.post_success,
        message: 'Movie Deleted Sucessfully'
      })
    }else{
      res.status(constants.error).send({
        status: constants.error,
        message: 'Permission Denied'
      })
    }
    } catch (error) {
      res.status(constants.error).send({
        data: null,
        error: error,
        status: constants.error,
        message: 'Error in deleting the Movie'
      })
    }
  };
  