# promisifier.js

Converts callback-based APIs to ES6 promises with chainable convenience promises.

## Installation

	npm install promisifier.js

## Compatibility

Requires nodejs with at least version 0.11.x with ES6 features enabled (--harmony).

## Recommendations

A generator capable of pumping promises, such as [co](https://github.com/visionmedia/co), increases fun/productivity!

## Examples

### Basic

	var promisifier = require('promisifier.js');
	var fs = promisifier(require('fs'));
	
	fs.readFile('someKindOfMonster.txt', 'utf8').then(function (contents) {
		console.log('contents: ' + contents);
	}, function (error) {
		console.log('error: ' + error);
	});
	
### Errorless Chainable

	var promisifier = require('promisifier.js');
	var fs = promisifier(require('fs'));
	
	fs.exists('someKindOfMonster.txt').errorless().then(function (result) {
		console.log('exists: ' + result[0]);
	});

### First Chainable

	var promisifier = require('promisifier.js');
	var request = promisifier(require('request'));

	request('http://www.google.com/').first().then(function (response) {
		console.log(response.statusCode);
	});
	
### Map Chainable

	var promisifier = require('promisifier.js');
	var request = promisifier(require('request'));

	request('http://www.google.com/').map('response', 'body').then(function (result) {
		console.log(result.response.statusCode);
	});

### Yieldable

	var co = require('co');
	var promisifier = require('promisifier.js');
	var request = promisifier(require('request'));

	co(function *() {
		var a = yield request('http://google.com').map('response', 'body');
		var b = yield request('http://yahoo.com').map('response', 'body');
		var c = yield request('http://cloudup.com').map('response', 'body');
		var all = yield [a, b, c];
		console.log(all[0].response.statusCode);
		console.log(all[1].response.statusCode);
		console.log(all[2].response.statusCode);
	})();