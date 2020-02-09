const https = require('http');

var registeredAccessory = false;
var Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	if (!registeredAccessory) {
		homebridge.registerAccessory("homebridge-servo-switch", "ServoSwitch", ServoSwitch);
		registeredAccessory = true
	}
};

function ServoSwitch(log, config) {
	this.log = log;
	this.isOn = true;
}

ServoSwitch.prototype = {
	getServices: function() {
		let informationService = new Service.AccessoryInformation();
		informationService
			.setCharacteristic(Characteristic.Manufacturer, "HomeSmart")
			.setCharacteristic(Characteristic.Model, "ServoSwitch")
			.setCharacteristic(Characteristic.SerialNumber, "123-456-789");

		let switchService = new Service.Switch("Light");
		switchService
			.getCharacteristic(Characteristic.On)
			.on('get', this.getSwitchOnCharacteristic.bind(this))
			.on('set', this.setSwitchOnCharacteristic.bind(this));

		this.informationService = informationService;
		this.switchService = switchService;
		return [informationService, switchService];
	},

	getSwitchOnCharacteristic: function(next) {
		next(null, this.isOn);
	},

	setSwitchOnCharacteristic: function(on, next) {
		https.get('http://192.168.1.140/activate', (resp) => {
			next();
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		  next();
		});
	}
};