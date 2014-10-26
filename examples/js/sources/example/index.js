require(['./sub.js'], function () {
    console.log('/example module loaded');
    
    module.exports.dirname = __dirname;
});
