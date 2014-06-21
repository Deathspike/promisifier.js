// Enable restricted mode.
'use strict';
// Initialize the first function.
let first;
// Initialize the errorless function.
let errorless;
// Initialize the make function.
let make;
// Initialize the map function.
let map;


// ==================================================
// Export the function.
// --------------------------------------------------
module.exports = function (object, skipProperties) {
	// Initialize the promise factory.
	let factory = typeof object !== 'function' ? {} : function () {
		// Initialize the promise.
		let promise = make(this, Array.prototype.slice.call(arguments), object);
		// Add the errorless function.
		promise.errorless = errorless(this, promise);
		// Add the map function.
		promise.map = map(this, promise);
		// Return the promise.
		return promise;
	};
	// Check if the properties are not skipped.
	if (!skipProperties) {
		// Iterate through each key.
		for (let key in object) {
			// Check if the key has not been inherited.
			if (typeof object[key] === 'function') {
				// Add the bound encapsulation.
				factory[key] = module.exports(object[key], true).bind(object);
			} else {
				// Add the value.
				factory[key] = object[key];
			}
		}
	}
	// Return the promise factory.
	return factory;
};

// ==================================================
// Create a promise with each chainable promise.
// --------------------------------------------------
let chainable = function (callback) {
	// Initialize the promise.
	let promise = new Promise(callback);
	// Add the errorless function.
	promise.errorless = errorless(this, promise);
	// Add the first function.
	promise.first = first(this, promise);
	// Add the map function.
	promise.map = map(this, promise);
	// Return the promise.
	return promise;
};

// ==================================================
// Create a promise which passes an error as success.
// --------------------------------------------------
errorless = function (context, promise) {
	// Return the encapsulation function.
	return function () {
		// Set the reject enforcement state.
		promise._enforceReject = true;
		// Return the promise.
		return chainable(function (resolve) {
			// Wait for the bound promise.
			promise.then(resolve, function () {
				// Resolve the promise.
				resolve.apply(context, Array.prototype.slice.call(arguments));
			});
		});
	};
};

// ==================================================
// Create a promise which passes the first array item.
// --------------------------------------------------
first = function (context, promise) {
	// Return the encapsulation function.
	return function () {
		// Return the promise.
		return chainable(function (resolve, reject) {
			// Wait for the promise.
			promise.then(function (value) {
				// Resolve the promise.
				resolve(Array.isArray(value) ? value[0] : value);			
			}, reject);
		});
	};
};

// ==================================================
// Create a promise encapsulation.
// --------------------------------------------------
make = function (context, localArgs, callback) {
	// Initialize the promise.
	let promise = chainable(function (resolve, reject) {
		// Invoke the callback function.
		let result = callback.apply(context, localArgs.concat(function (error) {
			// Check if an error has occurred.
			if (error || promise._enforceReject) {
				// Reject the promise.
				reject.call(this, Array.prototype.slice.call(arguments));
				// Stop the function.
				return;
			}
			// Resolve the promise.
			resolve.call(this, Array.prototype.slice.call(arguments, 1));
		}));
		// Check if the callback returned a promise.
		if (result && typeof result.then === 'function') {
			// Wait for the resulting promise.
			result.then(resolve, reject);
		}
	});
	// Return the promise.
	return promise;
};

// ==================================================
// Create a promise which maps an array to an object.
// --------------------------------------------------
map = function (context, promise) {
	// Return the encapsulation function.
	return function (map) {
		// Initialize the map.
		map = Array.isArray(map) ? map : Array.prototype.slice.call(arguments);
		// Return the promise.
		return chainable(function (resolve, reject) {
			// Wait for the promise.
			promise.then(function (value) {
				// Check if the value is valid.
				if (Array.isArray(value)) {
					// Initialize the result.
					let result = {};
					// Iterate through each value.
					for (let i = 0; i < map.length; i += 1) {
						// Map the value to the result.
						result[map[i]] = i < value.length ? value[i] : undefined;
					}
					// Resolve the promise with the result.
					resolve(result);
				} else {
					// Resolve the promise.
					resolve(value);
				}				
			}, reject);
		});
	};
};