'use strict';

const async = require('async');
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
    async.waterfall([
        function (callback) {
            Driver.findOne({ _id: req.params.driverId }, function (err, driver) {
                if (err) {
                    return callback(500);
                }
                else if (!driver) {
                    return callback({ status: 404, message: "driver not found" });
                }
                else if (!driver.available) {
                    return callback({ status: 403, message: "driver unavailable" });
                }
                else {
                    return callback(null);
                }
            })
        },
        function (callback) {
            Vehicle.findById(req.params.id, function (err, vehicle) {
                if (err) {
                    return callback(500);
                }
                else if (!vehicle) {
                    return callback({ status: 404, message: "vehicle not found" });
                }
                else if (vehicle.drivers.length === 3) {
                    return callback({ status: 403, message: "maximum drivers assigned, can't assign new" });
                }
                else {
                    return callback(null);
                }
            })
        },
        function (callback) {
            Vehicle.findByIdAndUpdate(req.params.id, { $addToSet: { drivers: req.params.driverId } }, { new: true }, function (err, vehicle) {
                if (err) {
                    return callback(500);
                }
                else {
                    return callback(null,vehicle)
                }
            })
        }

    ], function (err, updatedVehicle) {
        if (err) {
            if (err.message) {
                return res.status(err.status).json({ message: err.message });
            }
            else{
                return res.status(500).end();
            }
        }
        else {
            return res.json(updatedVehicle);
        }
    });
};

/**
 * @description - assignDriver with callback hell 
 */
// Controller.assignDriver = function (req, res) {
//     return Driver.findOne({ _id: req.params.driverId }, function (err, driver) {
//         if (err) {
//             return res.status(500).end();
//         }
//         else if (!driver) {
//             return res.status(404).json({ message: "driver not found" });
//         }
//         else if (!driver.available) {
//             return res.status(403).json({ message: "driver unavailable" });
//         }
//         else {
//             return Vehicle.findById(req.params.id, function (err, vehicle) {
//                 if (err) {
//                     return res.status(500).end();
//                 }
//                 else if (!vehicle) {
//                     return res.status(404).json({ message: "vehicle not found" });
//                 }
//                 else if (vehicle.drivers.length === 3) {
//                     return res.status(403).json({ message: "maximum drivers assigned, can't assign new" });
//                 }
//                 else {
//                     return Vehicle.findByIdAndUpdate(req.params.id, { $addToSet: { drivers: req.params.driverId } }, { new: true }, function (err, vehicle) {
//                         if (err) {
//                             return res.status(500).end();
//                         }
//                         else {
//                             return res.json(vehicle);
//                         }
//                     })
//                 }
//             })
//         }
//     })
// }

module.exports = Controller;
