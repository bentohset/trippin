const express = require('express')
const { signIn, signUp } = require('../controllers/userController');

const router = express.Router();

router.post('/signin', signIn);

router.post('/signup', signUp);

module.exports = router;