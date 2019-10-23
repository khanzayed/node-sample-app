var express = require('express');
var mainRouter = express.Router();

mainRouter.use('/user', require('../controllers/userController'))

module.exports = mainRouter;