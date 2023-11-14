const constants = require("../utilities/constants");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const schema = new passwordValidator();
const users = require("../models/users.model");

schema.is().min(8).is().max(100).has().uppercase().has().lowercase().has().digits(2)

exports.userSignUp = async (req, res) => {
  try {

    const isUserExist = await users.findOne({ email: req.body.email });
    if (isUserExist) {
      return res.status(constants.already_exists).send({
        data: null,
        error: 'Email Exists',
        status: constants.already_exists,
        message: 'User with mail already Exists'
      })
    }
    if (!schema.validate(req.body.password)) {
      return res.status(constants.error).send({
        data: null,
        error: schema.validate(req.body.password, { details: true }),
        status: constants.error,
        message: 'Enter Valid Password'
      })
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const userData = new users(req.body);
    await userData.save()
    res.status(constants.post_success).send({
      data: { user: userData },
      error: null,
      status: constants.post_success,
      message: 'User Account Created Succuessfully'
    })
  } catch (error) {
    res.status(constants.error).send({
      data: null,
      error: error,
      status: constants.error,
      message: 'Error in creating the User'
    })
  }
};

exports.userLogin = async (req, res) => {
  try {
    console.log(req.body,'data')
    const isUserExist = await users.findOne({ email: req.body.email }).lean();
    if (!isUserExist) {
      return res.status(constants.already_exists).send({
        data: null,
        error: "Email Doesn't Exists",
        status: constants.already_exists,
        message: "User with mail Doesn't  Exists"
      })
    }
    const isPasswordMatches = await bcrypt.compare(req.body.password, isUserExist.password);
    
    if (!isPasswordMatches) {
      return res.status(constants.error).send({
        data: null,
        error: 'Incorrect Password',
        status: constants.error,
        message: 'Enter Incorrect Password'
      })
    }
    const token = jwt.sign({ userId: isUserExist._id, role: isUserExist.role }, process.env.JWT_TOKEN_KEY);
    res.status(constants.post_success).send({
      data: { user: isUserExist.email, token: token },
      error: null,
      status: constants.post_success,
      message: 'Login Succuessfull'
    })
  } catch (error) {
    res.status(constants.error).send({
      data: null,
      error: error,
      status: constants.error,
      message: 'Error in Logging the User'
    })
  }
};