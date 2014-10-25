easy-require embedded url module<a name="url"><a>
================================

An embedded url package that offer, for this V1.0.0, a simple method : resolve


Usage :
-------

<b>NOTE : the commented lines are only interpretables in an ajax loaded module, see <a href="./readme.md#module-vars">readme.md#module-vars</a></b>

```JavaScript
require(['url'], function define(url) {
    var resolve;
    
    resolve = url.resolve;
    
    console.log(resolve());
    console.log(resolve('/'));
    console.log(resolve('./'));
    console.log(resolve('../'));
    //console.log(resolve(__dirname));
    //console.log(resolve(__filename));
    //console.log(resolve(__dirname, 'test', './'/*, ... */));
    console.log(resolve('http://www.google.be', 'test', '../'));
    console.log(resolve('https://www.google.be', 'test', '../'));
    console.log(resolve('ftp://www.google.be', 'test', '../'));
    console.log(resolve('//www.google.be', 'test', '../'));
});
```
