'use strict';

const Driver = require('./driver.model');
const Controller = {};

Controller.index = function (req, res) {
    return Driver.find({}, function (err, drivers) {
        if (err) {
            return res.status(500).end();
        }
        else {
            return res.json(drivers);
        }
    })
};

Controller.create = function (req, res) {
    return Driver.create(req.body, function (err, driver) {
        if (err) {
            return res.status(500).end();
        }
        else {
            return res.json(driver);
        }
    })
};


module.exports = Controller;
