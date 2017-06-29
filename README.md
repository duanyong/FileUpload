# jQuery FileUpload [![Build Status](https://travis-ci.org/jquery-form/form.svg?branch=master)](https://travis-ci.org/jquery-form/form)

## Overview
The jQuery FileUpload Plugin allows you to easily and unobtrusively upload file to server to use iframe. The main method is ajaxFileUpload(only one), gather information from the form element to determine how to manage the submit process. Both of these methods support numerous options which allows you to have full control over how the data is submitted.

No special markup is needed, just a normal form. Submitting a form with AJAX doesn't get any easier than this!

## Community
Want to contribute to jQuery FileUpload? Awesome! See [CONTRIBUTING](CONTRIBUTING.md) for more information.

### Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md) to ensure that this project is a welcoming place for **everyone** to contribute to. By participating in this project you agree to abide by its terms.

## Requirements
Requires jQuery 1.7.2 or later. Compatible with jQuery 2.x.x and 3.x.x.

## Download
* **Development:** [src/jquery.upload.js
](https://github.com/duanyong/FileUpload/blob/master/src/jquery.upload.js)
* **Production/Minified:** [dist/jquery.upload.min.js
](https://raw.githubusercontent.com/duanyong/FileUpload/master/dist/jquery.upload.min.js)

### DOWNLOAD
```html
<script src="https://github.com/duanyong/FileUpload/blob/master/src/jquery.upload.js"></script>
```
or
```html
<script src="https://raw.githubusercontent.com/duanyong/FileUpload/master/dist/jquery.upload.min.js"></script>
```

---

## API

### jqXHR
The jqXHR object is stored in element <em>data</em>-cache with the <code>jqxhr</code> key after each <code>ajaxFileUpload</code>
call. It can be accessed like this:

````javascript
 $('#upload').ajaxFileUpload({
     'url'           : '/upload?X-Progress-ID=' + s_uuid(),      //the upload url on server
     'dataType'      : 'json',                                   //types: json(default)，text，xml，html, scritp,jsonp
     'data'          : {'name' : 'duanyong', 'zip' : '200000'}
     'debug'         : true,
     'success'       : function(ret) {
        console.log(ret);
     }
 });
...
});
````

### ajaxForm( options )
Prepares a form to be submitted via AJAX by adding all of the necessary event listeners. It does **not** submit the form. Use `ajaxForm` in your document's `ready` function to prepare existing forms for AJAX submission, or with the `delegation` option to handle forms not yet added to the DOM.  
Use ajaxForm when you want the plugin to manage all the event binding for you.

````javascript
// upload is element in document. The element such as : <input id="upload" type="file" name="file" />
````
//Ex 1.
````javascript
$('#upload').ajaxFileUpload({
    'url'           : '/upload?X-Progress-ID=' + s_uuid(),      //the upload url on server
    'dataType'      : 'json',                                   //types: json(default)，text，xml，html, scritp,jsonp
    'data'          : {'name' : 'duanyong', 'zip' : '200000'}
    'debug'         : true,
    'success'       : function(ret) {
        console.log(ret);
    }
});
````

//Ex 2.
````javascript
$('#upload').ajaxFileUpload('/upload?X-Progress-ID=' + s_uuid(), function(ret) {
    console.log(ret);
});
````


---

## Options

### ajaxStart
Callback function invoked prior to form serialization. Provides an opportunity to manipulate the form before its values are retrieved. Returning `false` from the callback will prevent the form from being submitted. The callback is invoked with two arguments: the jQuery wrapped form object and the options object.

````javascript
ajaxStart: function($form, options) {
    // return false to cancel submit
}
````

### ajaxSend
Callback function invoked prior to form submission. Returning `false` from the callback will prevent the form from being submitted. The callback is invoked with three arguments: the form data in array format, the jQuery wrapped form object, and the options object.

````javascript
ajaxSend: function(arr, $form, options) {
    // form data array is an array of objects with name and value properties
    // [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
    // return false to cancel submit
}
````

### ajaxSuccess
Callback function invoked before processing fields. This provides a way to filter elements.

````javascript
ajaxSuccess: function(el, index) {
	if ( !$(el).hasClass('ignore') ) {
		return el;
	}
}
````

### ajaxComplete
Callback function invoked before processing fields. This provides a way to filter elements.

````javascript
ajaxComplete: function(el, index) {
	if ( !$(el).hasClass('ignore') ) {
		return el;
	}
}
````

### ajaxStop
Callback function invoked before processing fields. This provides a way to filter elements.

````javascript
ajaxStop: function(el, index) {
	if ( !$(el).hasClass('ignore') ) {
		return el;
	}
}
````