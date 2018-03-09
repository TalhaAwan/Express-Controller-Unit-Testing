module.exports = function (app) {
	app.use('/api/vehicles', require('./api/vehicle'));
	app.use('/api/drivers', require('./api/driver'));
};