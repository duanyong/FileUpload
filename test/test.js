/* global  */

'use strict';


var assert = chai.assert;
var fixture;

describe('form', function() {
	before(function() {
		fixture = $('#main').html();
	});

	beforeEach(function() {
		$('#main').html(fixture);
	});


	//it('"action" and "method" form attributes', function() {
	//	var f = $('#form1');
	//	assert.strictEqual(f.attr('action'), 'ajax/text.html', 'form "action"');
	//	assert.strictEqual(f.attr('method'), 'get', 'form "method"');
	//});
    //
	//it('formToArray: multi-select', function() {
	//	var a = $('#form1').formToArray();
	//	assert.strictEqual(a.constructor, Array, 'type check');
	//	assert.strictEqual(a.length, 13, 'array length');
	//	assert.strictEqual(arrayCount(a, 'Multiple'), 3, 'multi-select');
	//});
    //
	//it('formToArray: "action" and "method" inputs', function() {
	//	var a = $('#form1').formToArray();
	//	assert.strictEqual(a.constructor, Array, 'type check');
	//	assert.strictEqual(arrayValue(a, 'action'), '1', 'input name=action');
	//	assert.strictEqual(arrayValue(a, 'method'), '2', 'input name=method');
	//});
    //
	//it('formToArray: semantic test', function() {
	//	var formData = $('#form2').formToArray(true);
	//	var testData = ['a','b','c','d','e','f'];
	//	for (var i = 0; i < 6; i++) {
	//		assert.strictEqual(formData[i].name, testData[i], 'match value at index=' + i);
	//	}
	//});

});
