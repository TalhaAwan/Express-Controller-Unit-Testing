const sinon = require('sinon');
const Controller = require('./vehicle.controller')
const Driver = require('../driver/driver.model')
const Vehicle = require('./vehicle.model')

describe('Vehicle Controller', function () {
    let req = {
        body: {
            manufacturer: "Toyota",
            name: "Camry",
            model: "2018",
        },
        params: {
            id: "5aa06bb80738152cfd536fdc",
            driverId: "5aa13452e1e2c3277688e734"
        }
    },
        error = new Error({ error: "blah blah" }),
        res = {}, expectedResult;
    describe('create', function () {
        beforeEach(function () {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });
        it('should return created vehicle obj', sinon.test(function () {
            expectedResult = req.body
            this.stub(Vehicle, 'create').yields(null, expectedResult);
            Controller.create(req, res);
            sinon.assert.calledWith(Vehicle.create, req.body);
            sinon.assert.calledWith(res.json, sinon.match({ model: req.body.model }));
            sinon.assert.calledWith(res.json, sinon.match({ manufacturer: req.body.manufacturer }));
        }));
        it('should return status 500 on server error', sinon.test(function () {
            this.stub(Vehicle, 'create').yields(error);
            Controller.create(req, res);
            sinon.assert.calledWith(Vehicle.create, req.body);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        }));
    });

    describe('index (get all)', function () {
        beforeEach(function () {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
            expectedResult = [{}, {}, {}]
        });
        it('should return array of vehicles or empty array', sinon.test(function () {
            this.stub(Vehicle, 'find').yields(null, expectedResult);
            Controller.index(req, res);
            sinon.assert.calledWith(Vehicle.find, {});
            sinon.assert.calledWith(res.json, sinon.match.array);
        }));
        it('should return status 500 on server error', sinon.test(function () {
            this.stub(Vehicle, 'find').yields(error);
            Controller.index(req, res);
            sinon.assert.calledWith(Vehicle.find, {});
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        }));
    });

    describe('get', function () {
        beforeEach(function () {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
            expectedResult = req.body
        });
        it('should return vehicle obj', sinon.test(function () {
            this.stub(Vehicle, 'findById').yields(null, expectedResult);
            Controller.get(req, res);
            sinon.assert.calledWith(Vehicle.findById, req.params.id);
            sinon.assert.calledWith(res.json, sinon.match({ model: req.body.model }));
            sinon.assert.calledWith(res.json, sinon.match({ manufacturer: req.body.manufacturer }));
        }));
        it('should return 404 for non-existing vehicle id', sinon.test(function () {
            this.stub(Vehicle, 'findById').yields(null, null);
            Controller.get(req, res);
            sinon.assert.calledWith(Vehicle.findById, req.params.id);
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status(404).end);
        }));
        it('should return status 500 on server error', sinon.test(function () {
            this.stub(Vehicle, 'findById').yields(error);
            Controller.get(req, res);
            sinon.assert.calledWith(Vehicle.findById, req.params.id);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        }));
    });

    describe('destroy', function () {
        beforeEach(function () {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });
        it('should return successful deletion message', sinon.test(function () {
            this.stub(Vehicle, 'findByIdAndRemove').yields(null, {});
            Controller.destroy(req, res);
            sinon.assert.calledWith(Vehicle.findByIdAndRemove, req.params.id);
            sinon.assert.calledWith(res.json, sinon.match({ "message": "Vehicle deleted successfully!" }));
        }));
        it('should return 404 for non-existing vehicle id', sinon.test(function () {
            this.stub(Vehicle, 'findByIdAndRemove').yields(null, null);
            Controller.destroy(req, res);
            sinon.assert.calledWith(Vehicle.findByIdAndRemove, req.params.id);
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status(404).end);
        }));
        it('should return status 500 on server error', sinon.test(function () {
            this.stub(Vehicle, 'findByIdAndRemove').yields(error);
            Controller.destroy(req, res);
            sinon.assert.calledWith(Vehicle.findByIdAndRemove, req.params.id);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        }));
    });

    describe('update', function () {
        beforeEach(function () {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
            expectedResult = req.body
        });
        it('should return updated vehicle obj', sinon.test(function () {
            this.stub(Vehicle, 'findByIdAndUpdate').yields(null, expectedResult);
            Controller.update(req, res);
            sinon.assert.calledWith(Vehicle.findByIdAndUpdate, req.params.id, req.body, { new: true });
            sinon.assert.calledWith(res.json, sinon.match({ model: req.body.model }));
            sinon.assert.calledWith(res.json, sinon.match({ manufacturer: req.body.manufacturer }));
        }));
        it('should return 404 for non-existing vehicle id', sinon.test(function () {
            this.stub(Vehicle, 'findByIdAndUpdate').yields(null, null);
            Controller.update(req, res);
            sinon.assert.calledWith(Vehicle.findByIdAndUpdate, req.params.id, req.body, { new: true });
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status(404).end);
        }));
        it('should return status 500 on server error', sinon.test(function () {
            this.stub(Vehicle, 'findByIdAndUpdate').yields(error);
            Controller.update(req, res);
            sinon.assert.calledWith(Vehicle.findByIdAndUpdate, req.params.id, req.body, { new: true });
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        }));
    });

    describe('assignDriver', function () {
        const expectedDriver = { _id: req.params.driverId, available: true };
        beforeEach(function () {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy(), json: sinon.spy() })
            };
            expectedResult = req.body;
            expectedResult.drivers = [req.params.driverId]
        });
        it('should return status 500 on server error (finding driver)', sinon.test(function () {
            this.stub(Driver, 'findOne').yields(error);
            Controller.assignDriver(req, res);
            sinon.assert.calledOnce(Driver.findOne);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        }));
        it('should return 404 with a message for non-existing driver', sinon.test(function () {
            this.stub(Driver, 'findOne').yields(null, null);
            Controller.assignDriver(req, res);
            sinon.assert.calledWith(Driver.findOne, { _id: req.params.driverId }, { new: true });
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.status(404).json, { message: "driver not found" });
        }));
        it('should return 403 with a message for unavailable driver', sinon.test(function () {
            expectedResult.available = false;
            this.stub(Driver, 'findOne').yields(null, expectedResult);
            Controller.assignDriver(req, res);
            sinon.assert.calledWith(Driver.findOne, { _id: req.params.driverId }, { new: true });
            sinon.assert.calledWith(res.status, 403);
            sinon.assert.calledWith(res.status(403).json, { message: "driver unavailable" });
        }));
        it('should return status 500 on server error (assigning driver)', sinon.test(function () {
            this.stub(Driver, 'findOne').yields(null, expectedDriver);
            this.stub(Vehicle, 'findByIdAndUpdate').yields(error);
            Controller.assignDriver(req, res);
            sinon.assert.calledOnce(Vehicle.findByIdAndUpdate);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        }));
        it('should return 404 with a message for non-existing vehicle', sinon.test(function () {
            this.stub(Driver, 'findOne').yields(null, expectedDriver);
            this.stub(Vehicle, 'findByIdAndUpdate').yields(null, null);
            Controller.assignDriver(req, res);
            sinon.assert.calledWith(Driver.findOne, { _id: req.params.driverId }, { new: true });
            sinon.assert.calledWith(Vehicle.findByIdAndUpdate, req.params.id, { $addToSet: { drivers: req.params.driverId } }, { new: true });
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.status(404).json, { message: "vehicle not found" });
        })); 
        it('should return 403 with a message if 3 drivers already assigned', sinon.test(function () {
            expectedResult.drivers = [1, 2, 3, 4]
            this.stub(Driver, 'findOne').yields(null, expectedDriver);
            this.stub(Vehicle, 'findByIdAndUpdate').yields(null, expectedResult);
            Controller.assignDriver(req, res);
            sinon.assert.calledWith(Driver.findOne, { _id: req.params.driverId }, { new: true });
            sinon.assert.calledWith(res.status, 403);
            sinon.assert.calledWith(res.status(403).json, { message: "maximum drivers assigned, can't assign new" });
        }));
        it('should return updated vehicle obj with drivers array', sinon.test(function () {
            this.stub(Driver, 'findOne').yields(null, expectedDriver);
            this.stub(Vehicle, 'findByIdAndUpdate').yields(null, expectedResult);
            Controller.assignDriver(req, res);
            sinon.assert.calledWith(Driver.findOne, { _id: req.params.driverId }, { new: true });
            sinon.assert.calledWith(Vehicle.findByIdAndUpdate, req.params.id, { $addToSet: { drivers: req.params.driverId } }, { new: true });
            sinon.assert.calledWith(res.json, sinon.match({ drivers: expectedResult.drivers }));
        }));      
    });
});

