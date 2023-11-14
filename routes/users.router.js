
const router = require('express').Router();

const userAuthController = require('../controllers/user.controller');

router.post('/signup', userAuthController.userSignUp);

router.post('/login', userAuthController.userLogin);

module.exports = router;
