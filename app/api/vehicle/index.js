'use strict';

const Router = require('express').Router;
const Controller = require('./vehicle.controller');
const router = new Router();

router.get('/', Controller.index);
router.get('/:id', Controller.get);
router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.put('/:id/assign-driver/:driverId', Controller.assignDriver);
router.delete('/:id', Controller.destroy);

module.exports = router;
