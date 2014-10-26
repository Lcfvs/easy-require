easy-require
============

A simple way to require, asynchronously, your JavaScript browser modules.
This module loader is under MIT License.


Why an another module loader ?
------------------------------

Many loaders exist today but nothing that works like as I like...

Some are really too heavy, others, lighter, doesn't have the features I was looking for such as :
- an intelligent system to load my modules minified (production mode) or not (development mode)
- an ability to load some cross-domain modules (on d/recent browsers)


Include easy-require in your web page :
---------------------------------------

Add a script element to your web page.

For this example, I assume that I have two folders containing my modules `/js/sources` & `/js/min`, it's only an example, use the directories You want.

<b>development mode :</b>
```HTML
<script src="/js/sources/easy-require.js"></script>
```

<b>production mode :</b>
```HTML
<script src="/js/min/easy-require.min.js"></script>
```


Where do I need to put my modules files ?
-----------------------------------------

By default, when easy-require consider its own directory as the cwd (current working directory) but You can target an another on the dependency url declaration, such as a cross-domain url.


Do I rewrite my dependencies urls in my minified modules ?
---------------------------------------------------------

No! The internal dependency url resolution is based on the easy-require directory & extension.

For an "example" module :

If You loaded `/js/source/easy-require.js`<br />
`example` loads `/js/sources/example/index.js`<br />
`example/test.js` loads `/js/sources/example/test.js`

If You loaded `/js/min/easy-require.min.js`<br />
`example` loads `/js/min/example/index.min.js`<br />
`example/test.js` loads `/js/min/example/test.min.js`<br />


Usage :
-------

```JavaScript
require(
    ['dependency0', 'dependency1', '...'],
    function define(dependency0, dependency1 /*, ...*/) {
        // your module definition here
        module.exports = {};
    }
);
```


Module vars<a name="module-vars"></a> :
-------------

All ajax loaded modules, it excepts all main modules, have some known variables :

<b>global :</b> aliases the current window<br />
<b>module :</b> is a reference to the object representing the current module<br />
<b>exports :</b> the container to export your module definition<br />
<b>require :</b> the method to require some dependencies<br />
<b>__dirname :</b> the directory name of the current module<br />
<b>__filename :</b> the file name of the current module



Embedded modules :
------------------

<a href="./url.md#url">url.md</a>

<a href="./ajax.md#ajax">ajax.md</a>
