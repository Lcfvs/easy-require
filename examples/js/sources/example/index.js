require(['./sub'], function () {
    console.log('/test module loaded');
    
    module.exports.dirname = __dirname;
});
