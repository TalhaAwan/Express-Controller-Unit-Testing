'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var DriverSchema = new Schema({
    name: { type: String, required: true },
    licenseNum: { type: String, required: true },
    ssn: { type: String, required: true },
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Driver', DriverSchema);
