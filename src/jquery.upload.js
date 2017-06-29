/*!
 * jQuery FileUpload Plugin
 * version: 1.0.0
 * Requires jQuery v1.7.2 or later
 * Copyright 2017 Duan Yong
 * Project repository: https://github.com/duanyong/FileUpload
 * Dual licensed under the MIT and LGPLv3 licenses.
 * https://github.com/duanyong/FileUpload#license
 */

/* eslint-disable */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if (typeof jQuery === 'undefined') {
                // require('jQuery') returns a factory that requires window to build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop if it's defined (how jquery works)
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }

}(function ($) {
    /* eslint-enable */
    'use strict';

    /*
     Usage Note:
     -----------
     Do not use both ajaxSubmit and ajaxForm on the same form. These
     functions are mutually exclusive. Use ajaxSubmit if you want
     to bind your own submit handler to the form. For example,

     1,
    $('#upload').ajaxFileUpload({
        'url'           : '/upload?X-Progress-ID=' + s_uuid(),      //the upload url on server
        'dataType'      : 'json',                                   //types: json(default)，text，xml，html, scritp,jsonp
        'data'          : {'name' : 'duanyong', 'zip' : '200000'}
        'debug'         : true,
        'success'       : function(ret) {
            console.log(ret);
        }
    });


    2,
    $('#upload').ajaxFileUpload('/upload?X-Progress-ID=' + s_uuid(), function(ret) {
        console.log(ret);
    });

     When using ajaxForm, the ajaxSubmit function will be invoked for you
     at the appropriate time.
     */

    // expose debug var
    var debug   = false;
    var configs = {};

    // helper fn for console logging
    function log() {
        if (!debug) {
            return;
        }

        var msg = '[jquery.upload] ' + Array.prototype.join.call(arguments, '');

        if (window.console && window.console.log) {
            window.console.log(msg);

        } else if (window.opera && window.opera.postError) {
            window.opera.postError(msg);
        }
    }

    function error(s, xhr, status, e) {
        // If a local callback was specified, fire it
        if (s.error) {
            s.error.call(s.context || s, xhr, status, e );
        }

        // Fire the global callback
        if (s.global) {
            (s.context ? $(s.context) : $.event).trigger( 'ajaxError', [xhr, s, e] );
        }

        log('Excetion: ' + e && e.getMessage ? e.getMessage() : 'no descrption.');
    }

    function createIframe (id, uri) {
        //create frame
        var frameId     = 'jUploadFrame' + id,
            iframeHtml  = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';

        if (window.ActiveXObject) {
            if (typeof uri === 'boolean') {
                iframeHtml += ' src="' + 'javascript:false' + '"';

            } else if (typeof uri === 'string') {
                iframeHtml += ' src="' + uri + '"';
            }
        }

        iframeHtml += ' />';
        $(iframeHtml).appendTo(document.body);

        log('created iframe done.');

        return $('#' + frameId).length ? $('#' + frameId).get(0) : false;
    }


    function createForm(id, fileElementId, data) {
        //create form
        var formId = 'jUploadForm' + id,
            fileId = 'jUploadFile' + id,
            form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');

        if (data) {
            for (var name in data) {
                $('<input type="hidden" name="' + name + '" value="' + data[name] + '" />').appendTo(form);
            }
        }

        var oldElement = $('#' + fileElementId);
        var newElement = $(oldElement).clone(true);

        $(oldElement).attr('id', fileId);
        $(oldElement).before(newElement);
        $(oldElement).appendTo(form);


        //set attributes
        $(form).css('top',         '-1200px');
        $(form).css('left',        '-1200px');
        $(form).css('position',    'absolute');
        $(form).appendTo(document.body);

        log('created form done.');

        return $('#' + formId).length ? $('#' + formId).get(0) : false;
    }


    function uploadHttpData(r, type) {
        var data = !type;
        data = type === 'xml' || data ? r.responseXML : r.responseText;

        // If the type is "script", eval it in global context
        if (type == 'script') {
            $.globalEval(data);
        }

        // Get the JavaScript object, if JSON is used.
        if (type == 'json') {
            eval('data = ' + data);
        }

        // evaluate scripts within html
        if (type == 'html') {
            $('<div>').html(data).evalScripts();
        }

        return data;
    }


    function upload() {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
        var token   = $(this).attr('id'),
            setting = configs['' + token];

        var form   = createForm(token, token, (typeof(setting.data) == 'undefined' ? false : setting.data)),
            iframe = createIframe(token, setting.secureuri);

        if (!form || !iframe) {
            return error(setting, null, null, new Error('no form or iframe'));
        }


        // Watch for a new set of requests
        if (setting.global && ! $.active ++) {
            $.event.trigger('ajaxStart');
        }

        var xml = {}, requestDone = false;

        // Create the request object
        if (setting.global) {
            $.event.trigger('ajaxSend', [xml, setting]);
        }

        // Wait for a response to come back
        var uploadCallback = function(isTimeout) {
            try {
                if (iframe.contentWindow) {
                    if (iframe.contentWindow.document.body.textContent) {
                        xml.responseText = iframe.contentWindow.document.body.textContent;
                    }


                    if (iframe.contentWindow.document.body.outerContent) {
                        xml.responseText = iframe.contentWindow.document.body.outerContent;
                    }

                    xml.responseXML    = iframe.contentWindow.document.XMLDocument
                        ? iframe.contentWindow.document.XMLDocument
                        : iframe.contentWindow.document;

                } else if (iframe.contentDocument) {
                    xml.responseText    = iframe.contentDocument.document.body
                        ? iframe.contentDocument.document.body.innerHTML
                        : null;

                    xml.responseXML     = iframe.contentDocument.document.XMLDocument
                        ? iframe.contentDocument.document.XMLDocument
                        : iframe.contentDocument.document;
                }
            } catch(e) {
                error(setting, xml, null, e);
            }


            if (xml || isTimeout === 'timeout') {
                var status;

                try {
                    status = isTimeout !== 'timeout' ? 'success' : 'error';
                    // Make sure that the request was successful or notmodified
                    if (status !== 'error') {
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = uploadHttpData(xml, setting.dataType);
                        // If a local callback was specified, fire it and pass it the data
                        if (setting.success) {
                            setting.success(data, status);
                        }

                        // Fire the global callback
                        if (setting.global) {
                            $.event.trigger('ajaxSuccess', [xml, setting]);
                        }

                    } else {
                        error(setting, xml, status);
                    }
                } catch (e) {
                    error(setting, xml, status = 'error', e);
                }

                // The request was completed
                if (setting.global) {
                    $.event.trigger('ajaxComplete', [xml, setting]);
                }

                // Handle the global AJAX counter
                if (setting.global && ! --$.active) {
                    $.event.trigger('ajaxStop');
                }

                // Process result
                if (setting.complete) {
                    setting.complete(xml, status);
                }

                $(iframe).unbind();

                setTimeout(function() {
                    try {
                        $(iframe).remove();
                        $(form).remove();

                    } catch(e) {
                        error(setting, xml, null, e);
                    }
                }, 100);

                xml = null;
                requestDone = true;
            }
        };

        // Timeout checker
        if (setting.timeout > 0) {
            setTimeout(function() {
                // Check to see if the request is still happening
                if (!requestDone) {
                    uploadCallback('timeout');
                }
            }, setting.timeout);
        }

        try {
            $(form).attr('action', setting.url);
            $(form).attr('method', 'POST');
            $(form).attr('target', $(iframe).attr('id'));

            if (form.encoding) {
                $(form).attr('encoding', 'multipart/form-data');

            } else {
                $(form).attr('enctype', 'multipart/form-data');
            }

            $(form).submit();

        } catch(e) {
            error(setting, xml, null, e);
        }

        $(iframe).load(uploadCallback);

        return {abort: function () {}};
    }


    //$.ajaxFileUpload( url [, settings ] )
    $.fn.ajaxFileUpload = function(url, options) {
        var setting;
        var type = typeof options;

        if (type !== 'object') {
            setting = {};
        }

        if (typeof options === 'function') {
            setting.success = options;

        } else if (typeof options === 'object') {
            setting = $.extend(setting, options);
        }

        type = typeof url;

        if (type === 'string') {
            setting.url = url;

        } else if (type === 'object') {
            setting = $.extend(setting, url);
        }

        this.each(function(idx, input) {
            var id;
            if (!( id = $(input).attr('id') )) {
                $(input).attr('id', id = new Date().getTime());
            }

            debug = !!setting.debugg;

            configs['' + id] = $.extend({
                dataType: 'json'
            }, setting);

            $(input).bind('change', upload);
        });
    };
}));