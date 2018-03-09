'use strict';

const Router = require('express').Router;
const Controller = require('./driver.controller');
const router = new Router();

router.get('/', Controller.index);
router.post('/', Controller.create);

module.exports = router;
