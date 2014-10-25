easy-require embedded ajax module<a name="ajax"></a>
=================================

An embedded ajax package


Usage :
-------

```JavaScript
require(['ajax'], function define(ajax) {
    var request;
    
    request = {};
    request.url = '//www.google.be';
    
    request.onload = function onload(xhr) {
        console.log(xhr.reponseText);
    };
    
    ajax(request);
});
```


Modes :
------------

<b>ajax.ENQUEUE :</b> [DEFAULT] It's a semi-asynchronous mode, it creates a requests queue and resolves once a time, waiting for each the response of the previous.
Additionally, it retry to send a failed request, periodically and it calls the onload method on success, if any.

<b>ajax.ASYNC :</b>  It's an asynchronous mode, it send a request as soon as possible.
Additionally, it calls the onload method on success, if any.

<b>ajax.SYNC :</b>  It's a synchronous mode, it send a request and wait the response.


Request options :
-----------------

<b>url :</b> [REQUIRED] The request url<br />
<b>data :</b> The request data (default: null)<br />
<b>method :</b> The request method (default: 'GET')<br />
<b>mode :</b> The request (a)synchronous mode (default : ajax.ENQUEUE)<br />
<b>onload :</b> The request callback<br />
<b>delay :</b> The semi-asynchrounous request delay to retry to send it on failure (default: 1000ms)<br />
<b>headers :</b> The request headers, is an object that contains your headers<br />
    by default, all requests have a HTTP_X_REQUESTED_WITH header to 'xmlhttprequest'<br />
    and all non-GET requests have a Content-Type header to 'application/x-www-form-urlencoded'
