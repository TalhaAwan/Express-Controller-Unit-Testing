'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema

var VehicleSchema = new Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    manufacturer: { type: String, required: true },
    drivers: [{ type: Schema.Types.ObjectId, ref: 'Driver' },]
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
