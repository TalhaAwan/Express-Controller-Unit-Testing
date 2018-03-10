'use strict';

const Vehicle = require('./vehicle.model');
const Driver = require('../driver/driver.model');
const Controller = {};

Controller.index = function (req, res) {
    return Vehicle.find({}, function (err, vehicles) {
        if (err) {
            return res.status(500).end();
        }
        else {
            return res.json(vehicles);
        }
    })
};

Controller.create = function (req, res) {
    return Vehicle.create(req.body, function (err, vehicle) {
        if (err) {
            return res.status(500).end();
        }
        else {
            return res.json(vehicle);
        }
    })
};

Controller.get = function (req, res, next) {
    return Vehicle.findById(req.params.id, function (err, vehicle) {
        if (err) {
            return res.status(500).end();
        }
        else if (!vehicle) {
            return res.status(404).end();
        }
        else {
            return res.json(vehicle);
        }
    })
};

Controller.destroy = function (req, res) {
    return Vehicle.findByIdAndRemove(req.params.id, function (err, vehicle) {
        if (err) {
            return res.status(500).end();
        }
        else if (!vehicle) {
            return res.status(404).end();
        }
        else {
            return res.json({ "message": "Vehicle deleted successfully!" });
        }
    })
};



Controller.update = function (req, res) {
    return Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, vehicle) {
        if (err) {
            return res.status(500).end();
        }
        else if (!vehicle) {
            return res.status(404).end();
        }
        else {
            return res.json(vehicle);
        }
    })
};


Controller.assignDriver = function (req, res) {
    return Driver.findOne({ _id: req.params.driverId }, { new: true }, function (err, driver) {
        if (err) {
            return res.status(500).end();
        }
        else if (!driver) {
            return res.status(404).json({message: "driver not found"});
        }
        else if (!driver.available){
            return res.status(403).json({message: "driver unavailable"});
        }
        else {
            return Vehicle.findByIdAndUpdate(req.params.id, { $addToSet: { drivers: req.params.driverId } }, { new: true }, function (err, vehicle) {
                if (err) {
                    return res.status(500).end();
                }
                else if (!vehicle) {
                    return res.status(404).json({message: "vehicle not found"});
                } 
                else if (vehicle.drivers.length > 3 ) {
                    return res.status(403).json({message: "maximum drivers assigned, can't assign new"});
                }
                else {
                    return res.json(vehicle);
                }
            })
        }
    })
};

module.exports = Controller;
