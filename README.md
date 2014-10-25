easy-require
============

A simple way to require, asynchronously, your JavaScript browser modules.


Why an another module loader ?
------------------------------

Many loaders exist today but nothing that works like as I like...

Some are really too heavy, others, lighter, doesn't have the features I was looking for such as :
- an intelligent system to load my modules minified (production mode) or not (development mode)
- an ability to load some cross-domain modules (on d/recent browsers)


Include easy-require in your web page :
---------------------------------------

Add a script element to your web page.

For this example, I assume that I have two folders containing my modules `/js/sources` & `/js/min`, it's only an example, use the names You want.

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

By default, when easy-require consider its own directory as the <abbr title="current working directory">cwd</abbr> but You can target an another on the dependency url declaration, such as a cross-domain url.


Do I rewrite my dependencies url in my minified modules ?
---------------------------------------------------------

No! The internal dependency url resolution is based on the easy-require extension.

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


Embedded modules :
------------------

<b>url :</b> <a name="./url.md"></a>

<b>ajax :</b>
// documentation coming soon
